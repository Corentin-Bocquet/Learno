/* Test de l'écran de connexion et de la couche de synchronisation.
   Aucun appel réseau réel : on simule Supabase avec un faux fetch. */
const fs=require('fs');const {JSDOM,VirtualConsole}=(()=>{try{return require('jsdom')}catch(e){return require('/tmp/node_modules/jsdom')}})();
const path=require('path');
function learnoHTML(){
  const c=[process.env.LEARNO_HTML,
           path.join(__dirname,'..','index.html'),
           path.join(__dirname,'..','risklingo_v2.html'),
           '/sessions/lucid-wonderful-shannon/mnt/outputs/risklingo_v2.html'];
  for(const p of c){ if(p&&require('fs').existsSync(p))return p; }
  throw new Error("index.html introuvable");
}

const html=fs.readFileSync(learnoHTML(),'utf8');
const errs=[];const vc=new VirtualConsole();
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement/.test(e.message))errs.push(e.message.slice(0,200))});

/* ---------- faux serveur Supabase ---------- */
const DB={rows:{},users:{}};
function fakeFetch(url,opt){
  opt=opt||{}; const body=opt.body?JSON.parse(opt.body):null;
  const j=(o,st)=>Promise.resolve({ok:(st||200)<400,status:st||200,text:()=>Promise.resolve(JSON.stringify(o))});
  if(/\/auth\/v1\/signup/.test(url)){
    if(DB.users[body.email])return j({msg:"User already registered"},400);
    DB.users[body.email]={id:"uid-"+Object.keys(DB.users).length,pass:body.password};
    return j({access_token:"tok",refresh_token:"ref",expires_in:3600,user:{id:DB.users[body.email].id,email:body.email}});
  }
  if(/grant_type=password/.test(url)){
    const u=DB.users[body.email];
    if(!u||u.pass!==body.password)return j({error_description:"Invalid login credentials"},400);
    return j({access_token:"tok",refresh_token:"ref",expires_in:3600,user:{id:u.id,email:body.email}});
  }
  if(/grant_type=refresh_token/.test(url))return j({access_token:"tok2",refresh_token:"ref",expires_in:3600,user:{id:"uid-0",email:"a@b.c"}});
  if(/\/auth\/v1\/recover/.test(url))return j({});
  if(/\/rest\/v1\/learno_state\?select/.test(url)){
    const uid=url.split("user_id=eq.")[1];
    return j(DB.rows[uid]?[DB.rows[uid]]:[]);
  }
  if(/\/rest\/v1\/learno_state/.test(url)){ DB.rows[body.user_id]={rev:body.rev,data:body.data}; return j(null,201); }
  return j({},404);
}

function boot(store){
  const dom=new JSDOM(html,{runScripts:"outside-only",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc});
  const w=dom.window;
  if(store)Object.keys(store).forEach(k=>w.localStorage.setItem(k,store[k]));
  w.fetch=fakeFetch;
  w.HTMLMediaElement.prototype.play=()=>Promise.resolve();
  w.HTMLMediaElement.prototype.pause=()=>{};
  /* on rejoue les scripts en interne */
  const dom2=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc,
    beforeParse(win){
      win.fetch=fakeFetch;
      win.HTMLMediaElement.prototype.play=()=>Promise.resolve();
      win.HTMLMediaElement.prototype.pause=()=>{};
      if(store)Object.keys(store).forEach(k=>win.localStorage.setItem(k,store[k]));
    }});
  return dom2.window;
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
/* ---- 1. appareil neuf : l'écran de connexion s'ouvre ---- */
let w=boot(null);
await wait(900);
const auth=w.document.getElementById("auth");
console.log("écran ouvert sur appareil neuf :",auth.classList.contains("on"));
console.log("champ email :",!!w.document.getElementById("au-mail"),"| mot de passe :",!!w.document.getElementById("au-pass"));
console.log("courbe SVG :",w.document.querySelectorAll(".auth-curve svg path").length===1);
console.log("mascotte :",w.document.querySelectorAll(".auth-hero img.mascot").length===1);
console.log("onglets :",[...w.document.querySelectorAll(".auth-tabs button")].map(b=>b.textContent.trim()).join(" / "));

/* validation : email invalide */
w.document.getElementById("au-mail").value="pasunemail";
w.document.getElementById("au-pass").value="azerty";
w.eval("authGo()"); await wait(60);
console.log("email invalide refusé :",/valide/.test(w.document.getElementById("au-msg").textContent));

/* validation : mot de passe trop court */
w.document.getElementById("au-mail").value="corentin@test.fr";
w.document.getElementById("au-pass").value="abc";
w.eval("authGo()"); await wait(60);
console.log("mot de passe court refusé :",/6 caractères/.test(w.document.getElementById("au-msg").textContent));

/* inscription : les deux mots de passe doivent correspondre */
w.eval("authTab('signup')"); await wait(60);
w.document.getElementById("au-mail").value="corentin@test.fr";
w.document.getElementById("au-pass").value="azerty1";
w.document.getElementById("au-pass2").value="azerty2";
w.eval("authGo()"); await wait(60);
console.log("mots de passe différents refusés :",/identiques/.test(w.document.getElementById("au-msg").textContent));

/* inscription réussie */
w.document.getElementById("au-pass2").value="azerty1";
w.eval("authGo()"); await wait(500);
console.log("inscription :",w.eval("isLogged()"),"| écran fermé :",!w.document.getElementById("auth").classList.contains("on"));

/* on joue un peu puis on pousse */
w.eval("S.xp=1234;S.streak=9;S.stats.lessons=17;save();");
await wait(3200);
const uid=w.eval("SESS.user.id");
console.log("état envoyé au serveur :",!!DB.rows[uid],"| XP en base :",DB.rows[uid]&&DB.rows[uid].data.xp,"| rev :",DB.rows[uid]&&DB.rows[uid].rev);
const sess=w.localStorage.getItem("learno_auth");

/* ---- 2. deuxième appareil : session valide, rien en local ---- */
let w2=boot({learno_auth:sess});
await wait(1600);
console.log("appareil 2 - pas d'écran de connexion :",!w2.document.getElementById("auth").classList.contains("on"));
console.log("appareil 2 - XP récupérés :",w2.eval("S.xp"),"| série :",w2.eval("S.streak"),"| leçons :",w2.eval("S.stats.lessons"));
console.log("appareil 2 - les 9 cours sont là :",w2.eval("Object.keys(S.courses).length"));

/* on avance sur l'appareil 2 et on renvoie */
w2.eval("S.xp=2000;save();"); await wait(3200);
console.log("appareil 2 - renvoi :",DB.rows[uid].data.xp,"| rev :",DB.rows[uid].rev);

/* ---- 3. mauvais mot de passe ---- */
let w3=boot(null); await wait(900);
w3.eval("authTab('login')"); await wait(60);
w3.document.getElementById("au-mail").value="corentin@test.fr";
w3.document.getElementById("au-pass").value="mauvais";
w3.eval("authGo()"); await wait(400);
console.log("mauvais mot de passe :",w3.document.getElementById("au-msg").textContent.trim());

/* ---- 4. mot de passe oublié ---- */
w3.eval("authTab('reset')"); await wait(60);
console.log("écran reset sans champ mot de passe :",!w3.document.getElementById("au-pass"));
w3.document.getElementById("au-mail").value="corentin@test.fr";
w3.eval("authGo()"); await wait(400);
console.log("lien envoyé :",/lien/.test(w3.document.getElementById("au-msg").textContent));

/* ---- 5. continuer sans compte ---- */
w3.eval("authTab('login')"); await wait(60);
w3.eval("authSkip()"); await wait(120);
console.log("skip ferme l'écran :",!w3.document.getElementById("auth").classList.contains("on"));
w3.eval("S.xp=42;save();"); await wait(200);
console.log("sans compte, l'app sauvegarde quand même :",JSON.parse(w3.localStorage.getItem("risklingo_v2")).xp===42);

/* ---- 6. serveur injoignable : l'app ne casse pas ---- */
let w4=boot({learno_auth:sess,risklingo_v2:JSON.stringify(Object.assign(JSON.parse(w2.localStorage.getItem("risklingo_v2"))))});
w4.fetch=()=>Promise.reject(new Error("offline"));
await wait(1500);
w4.eval("S.xp=999;save();"); await wait(3000);
console.log("hors ligne - app vivante :",w4.eval("typeof S.xp"),w4.eval("S.xp"),"| statut :",w4.eval("CLOUD_STATUS"));
console.log("hors ligne - sauvegarde locale ok :",JSON.parse(w4.localStorage.getItem("risklingo_v2")).xp===999);
console.log("hors ligne - noeuds affichés :",w4.eval("(()=>{setTab('path');return document.querySelectorAll('#pathbody .node').length})()"));

/* ---- 7. déconnexion ---- */
w2.eval("doLogout();"); await wait(400);
console.log("déconnecté :",!w2.eval("isLogged()"),"| progression locale intacte :",w2.eval("S.xp")===2000);

console.log("\nERREURS:",errs.length,errs.slice(0,4));
process.exit(0);
})();
