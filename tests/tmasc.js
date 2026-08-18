/* Test des mascottes : 16 poses chargees, redirection des anciennes
   images, poses contextuelles, changement de personnage. */
const fs=require('fs');
const path=require('path');
const {JSDOM,VirtualConsole}=(()=>{try{return require('jsdom')}catch(e){return require('/tmp/node_modules/jsdom')}})();
function learnoHTML(){
  const c=[process.env.LEARNO_HTML,
           path.join(__dirname,'..','index.html'),
           path.join(__dirname,'..','risklingo_v2.html'),
           '/sessions/lucid-wonderful-shannon/mnt/outputs/risklingo_v2.html'];
  for(const p of c){ if(p&&fs.existsSync(p))return p; }
  throw new Error("index.html introuvable");
}
const html=fs.readFileSync(learnoHTML(),'utf8');
const errs=[];const vc=new VirtualConsole();
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement|Not implemented/.test(e.message))errs.push(e.message.slice(0,200))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc,
  beforeParse(w){
    w.HTMLMediaElement.prototype.play=()=>Promise.resolve();
    w.HTMLMediaElement.prototype.pause=()=>{};
    w.fetch=()=>Promise.reject(new Error("hors ligne"));
    w.matchMedia=w.matchMedia||(q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
  }});
const w=dom.window,doc=w.document;
const E=s=>w.eval(s);
const clic=el=>el&&el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
const wait=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
clic(doc.querySelector("#ob-go")); await wait(300);

console.log("=== LES 16 IMAGES ===");
let manquant=[], vides=[], tailles={};
["k","d"].forEach(p=>{ for(let i=0;i<8;i++){
  const k="m_"+p+i;
  const v=E("IMG['"+k+"']||''");
  if(!v)manquant.push(k);
  else if(!/^data:image\/webp;base64,/.test(v))vides.push(k);
  else tailles[k]=Math.round(v.length/1024);
}});
console.log("manquantes :",manquant.length?manquant.join(","):"aucune");
console.log("format incorrect :",vides.length?vides.join(","):"aucun");
const poids=Object.values(tailles);
console.log("16 images chargees :",poids.length,"| de",Math.min(...poids),"a",Math.max(...poids),"Ko | total",poids.reduce((a,b)=>a+b,0),"Ko");
console.log("toutes distinctes :",new Set(["k","d"].flatMap(p=>[0,1,2,3,4,5,6,7].map(i=>E("IMG['m_"+p+i+"']")))).size===16);

console.log("\n=== POSES ===");
console.log("poses declarees :",E("POSES.join(' ')"));
const toutes=E("POSES.map(p=>poseKey(p)).join(',')");
console.log("koala :",toutes);
console.log("diable :",E("POSES.map(p=>poseKey(p,'diable')).join(',')"));
console.log("balise complete :",/^<img src="data:image\/webp;base64,[^"]+" alt="[^"]+"/.test(E("masc('fier')")));
console.log("texte alternatif :",E("masc('triste')").match(/alt="([^"]*)"/)[1]);

console.log("\n=== ANCIENNES IMAGES REDIRIGEES ===");
const fox=E("img('fox')"), sad=E("img('foxSad')"), prof=E("img('prof')");
console.log("fox    ->",fox.includes(E("IMG.m_k5"))?"pose content":"NON REDIRIGE");
console.log("foxSad ->",sad.includes(E("IMG.m_k7"))?"pose triste":"NON REDIRIGE");
console.log("prof   ->",prof.includes(E("IMG.m_k2"))?"pose severe":"NON REDIRIGE");
console.log("cle inconnue conservee :",E("img('inconnue')").includes('src=""'));

console.log("\n=== ECRAN DE CONNEXION ===");
E("authOpen('login')"); await wait(250);
const imgsAuth=[...doc.querySelectorAll("#auth img")].map(i=>i.getAttribute("src"));
console.log("images :",imgsAuth.length,"| grande mascotte = pose salut :",imgsAuth[1]===E("IMG.m_k0"));
console.log("plus aucun renard :",!imgsAuth.some(s=>s===E("IMG.fox")||s===E("IMG.foxSad")));
E("authSkip()"); await wait(150);

console.log("\n=== POSES CONTEXTUELLES ===");
E("S.active='MRC';startLesson(1,0)"); await wait(300);
// on force une bonne reponse
let tour=0, vuJuste=false, vuFaux=false;
for(let k=0;k<8 && !(vuJuste&&vuFaux);k++){
  const t=E("A.ex?A.ex.t:null");
  if(t==="mcq"||t==="fill"||t==="story"){
    const bon=!vuJuste;
    E(`(()=>{const b=[...document.querySelectorAll('#qwrap .choice')].find(x=>+x.dataset.v===${bon?"A.ex.a":"(A.ex.a+1)%A.ex.o.length"});if(b)pick(b,+b.dataset.v);})()`);
  } else if(t==="tf"){ E(`(()=>{const b=[...document.querySelectorAll('#qwrap .choice')][0];if(b)pick(b,${!vuJuste}?A.ex.a:!A.ex.a);})()`); }
  else { E("(()=>{const b=document.getElementById('btn-check');if(b)b.disabled=false;})()"); }
  const b=doc.getElementById("btn-check");
  if(!b||b.disabled){ E("L.idx++"); E("nextQ()"); await wait(60); continue; }
  clic(b); await wait(90);
  const v=doc.querySelector("#verdict .verdict img");
  const src=v?v.getAttribute("src"):null;
  const juste=doc.getElementById("checkbar").className.includes("good");
  if(src){
    if(juste&&!vuJuste){ console.log("bonne reponse -> pose content :",src===E("IMG.m_k5")||src===E("IMG.m_k3")); vuJuste=true; }
    if(!juste&&!vuFaux){ console.log("mauvaise reponse -> pose triste :",src===E("IMG.m_k7")); vuFaux=true; }
  }
  const nb=doc.getElementById("btn-check"); if(nb&&!nb.disabled)clic(nb);
  await wait(70);
  if(!E("L"))break;
}
if(!vuJuste)console.log("bonne reponse : non testee sur cette serie");
if(!vuFaux)console.log("mauvaise reponse : non testee sur cette serie");
E("if(typeof quitLesson==='function')quitLesson()"); await wait(150);

console.log("\n=== PLUS DE COEURS ===");
E("heartsEmpty()"); await wait(150);
const hi=doc.querySelector("#mcard img");
console.log("pose triste dans la modale :",hi&&hi.getAttribute("src")===E("IMG.m_k7"));
E("closeModal()"); await wait(80);

console.log("\n=== SPLASH NOUVELLE NOTION ===");
E("newNotionSplash('Test de notion',null)"); await wait(200);
const sp=doc.querySelector(".splash img");
console.log("pose surprise :",sp&&sp.getAttribute("src")===E("IMG.m_k1"));
E("document.querySelectorAll('.splash').forEach(x=>x.remove())");

console.log("\n=== CHANGEMENT DE PERSONNAGE ===");
E("setTab('profile')"); await wait(250);
console.log("selecteur present :",doc.querySelectorAll("#profilebody .masccard").length,"cartes");
console.log("personnage courant :",E("persoId()"));
E("setPerso('diable')"); await wait(250);
console.log("apres bascule :",E("persoId()"),"| persiste :",JSON.parse(w.localStorage.getItem("risklingo_v2")).settings.perso);
console.log("img('fox') suit le personnage :",E("img('fox')").includes(E("IMG.m_d5")));
console.log("img('foxSad') suit :",E("img('foxSad')").includes(E("IMG.m_d7")));
E("authOpen('signup')"); await wait(200);
console.log("connexion affiche le diable :",[...doc.querySelectorAll("#auth img")].map(i=>i.getAttribute("src"))[1]===E("IMG.m_d0"));
E("authSkip()"); await wait(120);
E("mascGalerie()"); await wait(200);
console.log("galerie :",doc.querySelectorAll("#mcard .mascg img").length,"expressions");
E("closeModal()"); await wait(80);
E("setPerso('koala')"); await wait(200);
console.log("retour koala :",E("persoId()"));

console.log("\n=== NON REGRESSION ===");
["path","tasks","league","quests","habits","review","exam","errors","courses","profile"].forEach(t=>{
  E("setTab('"+t+"')");
  const b=doc.getElementById(t==="path"?"pathbody":t+"body");
  if(!doc.getElementById("sc-"+t).classList.contains("on")||!b||b.innerHTML.length<50)errs.push("onglet "+t+" casse");
});
console.log("les 10 onglets rendent :",!errs.some(e=>/onglet/.test(e)));
console.log("cours :",E("COURSES.length"),"| unites :",E("UNITS.length"),"| exercices :",E("EXOS.length"));
console.log("aucune image cassee :",[...doc.querySelectorAll("img")].filter(i=>!i.getAttribute("src")).length,"sans source");

console.log("\nERREURS:",errs.length,errs.slice(0,5));
process.exit(0);
})();
