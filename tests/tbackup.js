const fs=require('fs');const {JSDOM,VirtualConsole}=require('/tmp/node_modules/jsdom');
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
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement|Not implemented/.test(e.message))errs.push(e.message.slice(0,180))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc});
const w=dom.window,doc=w.document;
w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};
w.URL.createObjectURL=()=>"blob:fake"; w.URL.revokeObjectURL=()=>{};
let dl=null;
const realClick=w.HTMLAnchorElement.prototype.click;
w.HTMLAnchorElement.prototype.click=function(){ if(this.download)dl={name:this.download,href:this.href}; };
doc.execCommand=()=>true;
const click=el=>el&&el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
click(doc.querySelector("#ob-go"));

// ---- on fabrique une progression riche ----
w.eval(`S.xp=4820;S.streak=17;S.best=23;S.gems=140;S.name="Corentin";
S.courses.MRC.lessons['1-0']=3;S.courses.MRC.lessons['1-1']=2;S.courses.MRC.xp=900;
S.courses.POKER.calibrated=true;S.courses.POKER.level=3;
S.courses.RISK.calibrated=true;S.courses.RISK.level=2;
S.stats.lessons=64;S.stats.perfect=19;S.items={"1a":{n:3,c:3},"43a":{n:2,c:1}};
S.habits=[{id:"h1",name:"20 pompes",icon:"run",streak:12,best:12,count:12,lastDone:today(),prev:null}];
S.tasks={items:[{id:"t1",title:"Réviser MRC",lid:"l-etudes",cat:"Études",prio:1,xp:35,kind:"ia",subs:[],note:"",done:false,order:0}],lists:[{id:"l-etudes",n:"Études",c:"#1CB0F6"}],synced:Date.now(),open:null,filter:"all"};
S.hist={"2026-08-07":120,"2026-08-08":90};
save();`);
const before=w.eval("JSON.stringify({xp:S.xp,serie:S.streak,mrc:S.courses.MRC.lessons['1-0'],poker:S.courses.POKER.level,hab:S.habits.length,tasks:S.tasks.items.length,hist:Object.keys(S.hist).length})");
console.log("état de départ :",before);

// ---- boutons présents dans le profil ----
w.eval("setTab('profile')");
const pb=doc.querySelector("#profilebody").textContent;
console.log("bouton export présent :", /Exporter ma sauvegarde/.test(pb), "| bouton import :", /Importer une sauvegarde/.test(pb));

// ---- EXPORT ----
w.eval("exportBackup()");
const out=doc.getElementById("bk-out");
console.log("fichier téléchargé :", dl? dl.name : "aucun");
console.log("taille du JSON :", out.value.length, "caractères");
const pkg=JSON.parse(out.value);
console.log("paquet :", JSON.stringify({app:pkg.app,version:pkg.version,key:pkg.key,resumeXP:pkg.resume.xp,resumeSerie:pkg.resume.serie,cours:Object.keys(pkg.resume.cours).length}));
const backupTxt=out.value;
w.eval("copyBackup()");
w.eval("closeModal()");

// ---- on casse tout ----
w.eval("S=defaultState();S.xp=5;S.name='Inconnu';save();");
console.log("après remise à zéro :", w.eval("JSON.stringify({xp:S.xp,serie:S.streak,mrc:S.courses.MRC.lessons['1-0']||0,hab:S.habits.length})"));

// ---- IMPORT par texte collé ----
w.eval("askImportBackup()");
doc.getElementById("bk-in").value=backupTxt;
w.eval("readPastedBackup()");
const rev=doc.querySelector("#modal").textContent.replace(/\s+/g," ");
console.log("écran de confirmation :", /Confirmer la restauration/.test(rev), "| montre ACTUEL et APRÈS :", /ACTUEL/.test(rev)&&/APRÈS/.test(rev));
console.log("  extrait :", rev.slice(rev.indexOf("XP total"), rev.indexOf("XP total")+60).trim());
w.eval("applyBackup()");
const after=w.eval("JSON.stringify({xp:S.xp,serie:S.streak,mrc:S.courses.MRC.lessons['1-0'],poker:S.courses.POKER.level,hab:S.habits.length,tasks:S.tasks.items.length,hist:Object.keys(S.hist).length})");
console.log("après restauration :",after);
console.log("IDENTIQUE À L'ORIGINE :", before===after ? "OUI" : "NON");

// ---- persistance réelle dans le localStorage ----
w.eval("load()");
console.log("après rechargement depuis localStorage :", w.eval("JSON.stringify({xp:S.xp,nom:S.name,serie:S.streak})"));
const raw=JSON.parse(w.localStorage.getItem(w.eval("LS")));
console.log("écrit dans localStorage :", raw.xp, "XP,", raw.streak, "j de série, clé =", w.eval("LS"));

// ---- robustesse ----
w.eval("askImportBackup()");
doc.getElementById("bk-in").value="ceci n'est pas du json";
w.eval("readPastedBackup()");
console.log("JSON invalide rejeté :", !/Confirmer la restauration/.test(doc.querySelector("#modal").textContent));
doc.getElementById("bk-in").value='{"app":"Multilingo","data":{"foo":1}}';
w.eval("readPastedBackup()");
console.log("sauvegarde étrangère rejetée :", !/Confirmer la restauration/.test(doc.querySelector("#modal").textContent));
// état brut sans enveloppe
w.eval("closeModal();askImportBackup()");
doc.getElementById("bk-in").value=JSON.stringify(pkg.data);
w.eval("readPastedBackup()");
console.log("état brut sans enveloppe accepté :", /Confirmer la restauration/.test(doc.querySelector("#modal").textContent));
w.eval("applyBackup()");
console.log("  -> XP restauré :", w.eval("S.xp"));
// sauvegarde d'une ancienne version sans les nouveaux champs
w.eval("askImportBackup()");
doc.getElementById("bk-in").value=JSON.stringify({app:"Multilingo",data:{v:2,xp:777,streak:3,courses:{MRC:{xp:10,lessons:{},crowns:{},streak:0,best:0,lastDay:null,theta:0}}}});
w.eval("readPastedBackup()"); w.eval("applyBackup()");
console.log("vieille sauvegarde incomplète :","XP",w.eval("S.xp"),"| tous les cours recréés :",w.eval("COURSES.every(c=>!!S.courses[c.id])"),
  "| réglages par défaut :",w.eval("JSON.stringify(S.settings)"));
console.log("le jeu tourne encore :", w.eval("(()=>{setTab('path');return document.querySelectorAll('#pathbody .node').length})()"),"noeuds affichés");
console.log("ERREURS:",errs.length,errs.slice(0,5));
process.exit(0);
