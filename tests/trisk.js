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
w.eval("S.courses.MRC.lessons['1-0']=3;S.courses.POKER.level=3;S.courses.YT.calibrated=true;S.xp=3210;S.streak=9;save();load()");
console.log("progression intacte : MRC",w.eval("S.courses.MRC.lessons['1-0']"),"| poker niv",w.eval("S.courses.POKER.level"),
  "| YT calibré",w.eval("S.courses.YT.calibrated"),"| XP",w.eval("S.xp"),"| série",w.eval("S.streak"));
console.log("cours :");
console.log(w.eval(`COURSES.map(c=>"  "+c.id.padEnd(7)+String(courseUnits(c.id).length).padStart(3)+" unités  "+String(courseUnits(c.id).reduce((n,u)=>n+unitExos(u.id).length,0)).padStart(4)+" exos").join("\\n")`));
["YT","RISK"].forEach(cid=>{
  w.eval(`setCourse('${cid}')`);
  console.log("\n"+cid+" : test de niveau proposé:", /Où en es-tu vraiment/.test(doc.querySelector("#pathbody").textContent),
    "| questions:",w.eval(`calibPool('${cid}').length`),"| unités affichées:",doc.querySelectorAll("#pathbody .unitbar").length);
});
w.eval("S.seenNotions=EXOS.map(e=>e.i)");
function open(id){w.eval(`L={uid:99,li:0,cid:'RISK',mode:'test',queue:[EXOS.find(e=>e.i==='${id}')],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[],lv:{}};show('lesson');nextQ()`);}
open("101c");
console.log("\ndashboard bancaire :",doc.querySelectorAll("#qwrap .ytcard").length,"cartes | entête:",doc.querySelector("#qwrap .ythead")?.textContent.trim().slice(0,40));
console.log("  valeurs:",[...doc.querySelectorAll("#qwrap .ytv")].map(e=>e.textContent).join(" | "));
open("109c");
console.log("tableau KPI/KCI/KRI :",doc.querySelectorAll("#qwrap .ytr").length,"lignes |",[...doc.querySelectorAll("#qwrap .ytr")].slice(1).map(r=>r.textContent.replace(/\s+/g," ").trim()).join(" // ").slice(0,140));
open("105a");
console.log("distribution VaR :",doc.querySelectorAll("#qwrap .ytr").length,"lignes");
open("rs0");
console.log("curseur seuil :",!!doc.querySelector("#qwrap .sld"),"| valeur initiale:",doc.querySelector("#sldval")?.textContent);
w.eval("sliderMove(4.5)"); click(doc.querySelector("#btn-check"));
console.log("verdict CET1 4,5 % :",doc.querySelector("#checkbar").className.includes("good")?"CORRECT":"faux");
open("101e0");
const i=doc.querySelector("#numin"); i.value="2000"; i.dispatchEvent(new w.Event("input",{bubbles:true}));
click(doc.querySelector("#btn-check"));
console.log("calcul EL 2000 EUR :",doc.querySelector("#checkbar").className.includes("good")?"CORRECT":"faux","| calculatrice:",!!doc.getElementById("calc-fab"));
console.log("\nrépétition des réflexes RISK :");
console.log("  EL :",w.eval("EXOS.filter(e=>/^101e/.test(e.i)).length"),"| VaR :",w.eval("EXOS.filter(e=>/^104v/.test(e.i)).length"),
  "| CET1 :",w.eval("EXOS.filter(e=>/^102c/.test(e.i)).length"),"| DSCR :",w.eval("EXOS.filter(e=>/^101d/.test(e.i)).length"),
  "| LCR/NSFR :",w.eval("EXOS.filter(e=>/^107l/.test(e.i)).length"),"| output floor :",w.eval("EXOS.filter(e=>/^111o/.test(e.i)).length"),
  "| curseurs :",w.eval("EXOS.filter(e=>/^rs/.test(e.i)).length"));
console.log("ERREURS:",errs.length,errs.slice(0,5));
process.exit(0);
