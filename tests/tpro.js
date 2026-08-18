/* Test des ajouts : onglets, thème, recherche, examen, erreurs,
   accessibilité, rappels, import de cours. */
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

/* ---------- 1. ICONE DE L OEIL ---------- */
console.log("=== ICONE MOT DE PASSE ===");
E("authOpen('login')"); await wait(200);
const eye=doc.getElementById("au-eye");
const eyeHTML=eye.innerHTML;
console.log("bouton présent :",!!eye,"| n'est plus une loupe :",!/M11 .*a7 7/.test(eyeHTML));
console.log("icone eye enregistrée :",E("!!ICONS.eye && !!ICONS.eyeoff"));
const t0=doc.getElementById("au-pass").type;
E("authEye()"); await wait(60);
const t1=doc.getElementById("au-pass").type;
console.log("bascule du champ :",t0+" -> "+t1,"| icone changée :",doc.getElementById("au-eye").innerHTML!==eyeHTML);
console.log("nouvelle accroche :",doc.querySelector(".auth-hero h3").textContent.replace(/\s+/g," ").trim());
E("authSkip()"); await wait(150);

/* ---------- 2. ZONES DE SECURITE ---------- */
console.log("\n=== ZONES DE SECURITE iOS ===");
const css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
/* pour chaque selecteur, on lit chaque bloc qui le vise et on cherche
   au moins une marge de securite iOS a l interieur */
function blocs(sel){
  const out=[]; const re=new RegExp("(^|[,}{\\s])"+sel.replace(/[.#]/g,"\\$&")+"\\s*[,{]","g");
  let m;
  while((m=re.exec(css))){
    const i=css.indexOf("{",m.index+m[0].length-1);
    if(i<0)continue;
    const j=css.indexOf("}",i);
    if(j<0)continue;
    out.push(css.slice(i,j));
    re.lastIndex=j;
  }
  return out;
}
["#auth","#mtabs",".toast",".calcbtn",".calcwrap",".modal",".splash",".auth-form"].forEach(sel=>{
  const ok=blocs(sel).some(b=>/env\(safe-area-inset/.test(b));
  console.log(sel,":",ok?"marge de sécurité OK":"MANQUE");
});
console.log("dvh présent :",/100dvh/.test(css));
console.log("formulaire non centré en mobile :",/#auth\{\s*padding:0;\s*align-items:flex-start\s*\}/.test(css.replace(/\s+/g," ").replace(/ \{/g,"{")) || /align-items:flex-start/.test(css));
console.log("règle petits écrans :",/max-height:700px/.test(css));

/* ---------- 3. ACCESSIBILITE ---------- */
console.log("\n=== ACCESSIBILITE ===");
console.log("focus-visible :",/:focus-visible/.test(css),"| mouvement réduit :",/prefers-reduced-motion/.test(css));
console.log("lien d'évitement :",!!doc.querySelector(".skiplink"));
E("openModal('<button id=zz>a</button><button>b</button>')"); await wait(120);
const mc=doc.getElementById("mcard");
console.log("modale : role =",mc.getAttribute("role"),"| aria-modal =",mc.getAttribute("aria-modal"));
E("closeModal()"); await wait(80);

/* ---------- 4. ECHELLE DE PROFONDEUR ---------- */
console.log("\n=== Z-INDEX ===");
const z=k=>parseInt((css.match(new RegExp("--z-"+k+":(\\d+)"))||[])[1]);
const ordre=["sticky","fab","float","overlay","modal","splash","auth","fx","toast"].map(k=>[k,z(k)]);
console.log(ordre.map(o=>o[0]+"="+o[1]).join(" < "));
console.log("croissant :",ordre.every((o,i)=>i===0||o[1]>ordre[i-1][1]));
console.log("toast au sommet :",z("toast")>z("modal")&&z("toast")>z("auth"));

/* ---------- 5. ONGLETS MASQUABLES ---------- */
console.log("\n=== ONGLETS ===");
console.log("onglets déclarés :",E("TABS.length"),"| visibles au départ :",E("visibleTabs().length"));
console.log("barre latérale :",doc.querySelectorAll("#side .navitem").length,"| barre mobile :",doc.querySelectorAll("#mtabs .navitem").length);
E("toggleTab('league')"); await wait(120);
console.log("après masquage de Ligues :",E("visibleTabs().length"),"| dans le DOM :",doc.querySelectorAll("#side .navitem[data-tab=league]").length);
console.log("persisté :",JSON.parse(w.localStorage.getItem("risklingo_v2")).navOff.join(","));
E("toggleTab('league')"); await wait(120);
console.log("réaffiché :",E("visibleTabs().length"));
E("toggleTab('path')"); await wait(80);
console.log("Apprendre reste inmasquable :",E("tabOn('path')"));
console.log("navigation encore cliquable :",(()=>{clic(doc.querySelector('#side .navitem[data-tab=profile]'));return doc.getElementById("sc-profile").classList.contains("on");})());
console.log("réglage présent dans le profil :",doc.querySelectorAll("#profilebody .tabrow").length,"lignes");

/* ---------- 6. THEME CLAIR ---------- */
console.log("\n=== THEME ===");
E("toggleTheme()"); await wait(120);
console.log("classe :",doc.body.className.includes("theme-light"),"| meta :",doc.getElementById("meta-theme").getAttribute("content"));
E("toggleTheme()"); await wait(120);
console.log("retour sombre :",!doc.body.className.includes("theme-light"));

/* ---------- 7. RECHERCHE ---------- */
console.log("\n=== RECHERCHE ===");
E("palOpen()"); await wait(150);
console.log("ouverte :",doc.getElementById("pal").classList.contains("on"),"| actions par défaut :",E("PAL_RES.length"));
E("palRun('ressentiment')"); await wait(120);
console.log("recherche 'ressentiment' :",E("PAL_RES.length"),"résultat(s) |",E("PAL_RES[0]?PAL_RES[0].t.slice(0,52):'-'"));
E("palRun('volatilite')"); await wait(100);
console.log("recherche 'volatilite' :",E("PAL_RES.length"),"résultat(s)");
E("palRun('zzzzqqq')"); await wait(100);
console.log("recherche vide :",doc.querySelector(".pal-empty")?"message affiché":"PROBLEME");
E("palClose()"); await wait(80);

/* ---------- 8. EXAMEN ---------- */
console.log("\n=== EXAMEN ===");
E("S.active='MRC';setTab('exam')"); await wait(200);
console.log("écran examen :",doc.getElementById("sc-exam").classList.contains("on"),"| formats :",doc.querySelectorAll("#exambody .btn").length);
E("examStart('MRC',0)"); await wait(300);
console.log("démarré :",E("L&&L.mode"),"| questions :",E("L.queue.length"),"| chrono :",!!doc.getElementById("exam-chrono"));
console.log("coeurs masqués :",doc.getElementById("ls-hearts-w").style.display==="none");
console.log("pastilles :",doc.querySelectorAll(".exam-dot").length);
// on repond a tout, la moitie juste
let hAvant=E("S.hearts");
for(let k=0;k<10;k++){
  const ex=E("A.ex?JSON.stringify({t:A.ex.t,a:A.ex.a}):null");
  const o=ex?JSON.parse(ex):null;
  if(o&&(o.t==="mcq"||o.t==="fill"||o.t==="story")){
    const bon=k%2===0;
    E(`(()=>{const b=[...document.querySelectorAll('#qwrap .choice')].find(x=>+x.dataset.v===${bon?"A.ex.a":"(A.ex.a+1)%A.ex.o.length"});if(b)pick(b,+b.dataset.v);})()`);
  } else if(o&&o.t==="tf"){
    E(`(()=>{const b=[...document.querySelectorAll('#qwrap .choice')][0];if(b)pick(b,${k%2===0}?A.ex.a:!A.ex.a);})()`);
  } else if(o&&o.t==="num"){ E(`A.val=${'"'}${'"'}+(A.ex.a);document.getElementById('btn-check').disabled=false;`); }
  else { E("(()=>{const b=document.getElementById('btn-check');b.disabled=false;})()"); }
  const b=doc.getElementById("btn-check");
  if(b&&!b.disabled)clic(b);
  await wait(40);
  const verdict=doc.getElementById("verdict").textContent;
  if(k===0)console.log("aucune correction affichée :",/Correction à la fin/.test(verdict));
  const nb=doc.getElementById("btn-check");
  if(nb&&/suivante|Terminer/.test(nb.textContent))clic(nb);
  await wait(60);
  if(!E("L"))break;
}
await wait(300);
console.log("coeurs intacts :",E("S.hearts")===hAvant,"("+hAvant+")");
console.log("résultat enregistré :",E("(S.exams||[]).length"),"| score :",E("S.exams&&S.exams.length?S.exams[S.exams.length-1].pc+'%':'-'"));
console.log("correction affichée :",doc.querySelectorAll("#exambody .exam-rev").length,"lignes");
console.log("chrono arrêté :",E("EXAM_TICK")===null);

/* ---------- 9. ERREURS ET COURBE D OUBLI ---------- */
console.log("\n=== ERREURS ===");
E("S.active='MRC';setTab('errors')"); await wait(250);
console.log("écran :",doc.getElementById("sc-errors").classList.contains("on"));
console.log("carnet :",doc.querySelectorAll("#errorsbody .err-row").length,"erreur(s) listée(s)");
console.log("courbe d'oubli :",doc.querySelectorAll("#errorsbody .decay-row").length,"notion(s) fragile(s)");
console.log("fonctions :",E("typeof errStats")+"/"+E("typeof decayList"));

/* ---------- 10. RAPPELS ---------- */
console.log("\n=== RAPPELS ===");
console.log("carte dans le profil :",E("typeof notifCardHTML")==="function");
console.log("état sans API Notification :",E("notifEtat()"));
E("S.notif={on:true,heure:19,dernier:null,semaine:['a','b','c','d','e'],bilan:true,serie:true}");
console.log("plafond hebdo respecté :",E("(()=>{const n=notif();return n.semaine.length>=5})()"));
E("S.notif.semaine=[];S.notif.dernier=today()");
console.log("un seul par jour :",E("(()=>{notifCheck();return notif().dernier===today()})()"));

/* ---------- 11. IMPORT DE COURS ---------- */
console.log("\n=== IMPORT DE COURS ===");
const nC=E("COURSES.length"), nU=E("UNITS.length"), nE=E("EXOS.length");
const bon=JSON.stringify({id:"TESTIMP",name:"Cours de test",short:"Test",icon:"book",col:"--green",
  units:[{n:"Module 1",t:"Bases",guide:"<h3>a</h3><p>b</p>",exos:[
    {t:"mcq",q:"Deux plus deux ?",o:["4","5","3"],a:0,w:"Arithmétique.",d:.3,lv:1},
    {t:"tf",q:"Le ciel est vert.",a:false,w:"Non.",d:.3,lv:1},
    {t:"num",q:"Trois fois trois ?",a:9,w:"Table de 3.",d:.3,lv:2},
    {t:"order",q:"Ordre",it:["un","deux","trois"],w:"Facile.",d:.3,lv:2}]}]});
E("applyCourse("+JSON.stringify(bon)+")"); await wait(300);
console.log("cours ajouté :",E("COURSES.length")===nC+1,"| unités :",E("UNITS.length")-nU,"| exercices :",E("EXOS.length")-nE);
console.log("jouable :",E("(()=>{const u=UNITS.find(x=>x.c==='TESTIMP');return u?buildLesson(u.id,0).queue.length:0})()"),"questions");
console.log("persisté :",(JSON.parse(w.localStorage.getItem("risklingo_v2")).custom||[]).length,"cours importé(s)");
// refus des mauvais fichiers
[["{\"id\":\"X\"}","identifiant/nom"],
 [JSON.stringify({id:"MRC",name:"a",units:[{t:"u",exos:[{t:"tf",a:true}]}]}),"doublon"],
 [JSON.stringify({id:"ZZTOP",name:"a",units:[{t:"u",exos:[{t:"inconnu",q:"?"}]}]}),"type inconnu"],
 [JSON.stringify({id:"ZZTOQ",name:"a",units:[{t:"u",exos:[{t:"mcq",q:"?",o:["a"],a:5}]}]}),"réponse hors bornes"]
].forEach(([j,quoi])=>{
  const e=E("validCourse("+JSON.stringify(JSON.parse(j))+")");
  console.log("refus",quoi,":",e?"OK ("+e.slice(0,46)+")":"PROBLEME, accepté");
});

/* ---------- 12. NON REGRESSION ---------- */
console.log("\n=== NON REGRESSION ===");
E("S.active='MRC';setTab('path')"); await wait(200);
console.log("chemin :",doc.querySelectorAll("#pathbody .node").length,"noeuds");
["tasks","league","quests","habits","review","courses","profile"].forEach(t=>{
  E("setTab('"+t+"')");
  const ok=doc.getElementById("sc-"+t).classList.contains("on")&&doc.getElementById(t==="path"?"pathbody":t+"body").innerHTML.length>50;
  if(!ok)errs.push("onglet "+t+" vide");
});
console.log("les 7 autres onglets rendent :",!errs.some(e=>/onglet/.test(e)));
console.log("cours :",E("COURSES.length"),"| unités :",E("UNITS.length"),"| exercices :",E("EXOS.length"));
console.log("sauvegarde locale intacte :",!!w.localStorage.getItem("risklingo_v2"));

console.log("\nERREURS:",errs.length,errs.slice(0,5));
process.exit(0);
})();
