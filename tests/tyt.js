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
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement/.test(e.message))errs.push(e.message.slice(0,160))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc});
const w=dom.window,doc=w.document;
w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};
const click=el=>el&&el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
click(doc.querySelector("#ob-go"));
w.eval("S.courses.MRC.lessons['1-0']=3;S.courses.POKER.level=3;S.courses.DAMES.calibrated=true;S.xp=2500;save();load()");
console.log("progression intacte : MRC",w.eval("S.courses.MRC.lessons['1-0']"),"| poker niv",w.eval("S.courses.POKER.level"),"| dames calibré",w.eval("S.courses.DAMES.calibrated"),"| XP",w.eval("S.xp"));
console.log("cours:",w.eval("COURSES.map(c=>c.id+'('+courseUnits(c.id).length+'u/'+courseUnits(c.id).reduce((n,u)=>n+unitExos(u.id).length,0)+'e)').join(' ')"));
w.eval("setCourse('YT')");
console.log("test de niveau proposé:", /Où en es-tu vraiment/.test(doc.querySelector("#pathbody").textContent),
  "| questions dispo:",w.eval("calibPool('YT').length"));
w.eval("S.seenNotions=EXOS.map(e=>e.i)");
function open(id){w.eval(`L={uid:76,li:0,cid:'YT',mode:'test',queue:[EXOS.find(e=>e.i==='${id}')],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[],lv:{}};show('lesson');nextQ()`);}
open("78d0");
console.log("Studio :",doc.querySelectorAll("#qwrap .ytcard").length,"cartes |",doc.querySelector("#qwrap .ytv")?.textContent,"| entête:",doc.querySelector("#qwrap .ythead")?.textContent.trim().slice(0,26));
open("77a");
console.log("tableau vidéos :",doc.querySelectorAll("#qwrap .ytr").length,"lignes | taux affiché:",[...doc.querySelectorAll("#qwrap .ytt")].map(e=>e.textContent).join(" "));
open("80c0");
console.log("courbe :",doc.querySelectorAll("#qwrap .retzone").length,"zones cliquables | bouton:",!doc.querySelector("#btn-check").disabled);
w.eval("retTap(0)");
console.log("après clic zone 0 :",doc.querySelectorAll("#qwrap .retzone.on").length,"sélectionnée | bouton actif:",!doc.querySelector("#btn-check").disabled);
click(doc.querySelector("#btn-check"));
console.log("verdict courbe :",doc.querySelector("#checkbar").className.includes("good")?"CORRECT":"faux");
open("79a");
console.log("miniatures :",doc.querySelectorAll("#qwrap .thumbcard").length,"| svg:",doc.querySelectorAll("#qwrap .thumbsvg").length);
open("sl0");
console.log("curseur :",!!doc.querySelector("#qwrap .sld"),"| valeur:",doc.querySelector("#sldval")?.textContent);
w.eval("sliderMove(2)");
console.log("après réglage :",doc.querySelector("#sldval")?.textContent);
click(doc.querySelector("#btn-check"));
console.log("verdict curseur :",doc.querySelector("#checkbar").className.includes("good")?"CORRECT":"faux");
console.log("\nrépétition (mêmes réflexes travaillés plusieurs fois) :");
console.log(w.eval(`(()=>{const g={};courseUnits("YT").flatMap(u=>unitExos(u.id)).forEach(e=>{g[e.t]=(g[e.t]||0)+1});return JSON.stringify(g)})()`));
console.log("calculs de taux répétés :",w.eval("EXOS.filter(e=>/^77c/.test(e.i)).length"),
  "| diagnostics Studio :",w.eval("EXOS.filter(e=>e.t==='studio').length"),
  "| courbes :",w.eval("EXOS.filter(e=>e.t==='curve').length"),
  "| curseurs :",w.eval("EXOS.filter(e=>e.t==='slider').length"));
console.log("ERREURS:",errs.length,errs.slice(0,5));
process.exit(0);
