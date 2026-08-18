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

// --- progression existante préservée ---
w.eval("S.courses.MRC.lessons['1-0']=3;S.courses.MRC.xp=420;S.xp=999;S.streak=12;save();load();");
console.log("progression MRC après rechargement:",w.eval("S.courses.MRC.lessons['1-0']"),"| XP",w.eval("S.xp"),"| série",w.eval("S.streak"));
console.log("cours POKER initialisé:",w.eval("JSON.stringify({cal:S.courses.POKER.calibrated,lv:S.courses.POKER.level})"));

// --- bandeau de calibrage ---
w.eval("setCourse('POKER')");
const body=doc.querySelector("#pathbody").textContent.replace(/\s+/g," ");
console.log("bandeau calibrage visible:", /Où en es-tu vraiment/.test(body));
console.log("questions de calibrage disponibles:", w.eval("calibPool('POKER').length"),
  "| par niveau:", w.eval("JSON.stringify([1,2,3,4,5].map(l=>EXOS.filter(e=>e.lv===l&&courseUnits('POKER').map(u=>u.id).includes(e.u)).length))"));

// --- passer le test en répondant juste ---
function answerCur(correct){
  const sp=doc.querySelector(".splash"); if(sp)click(sp.querySelector("#sp-go"));
  const ex=w.eval("A&&A.ex"); if(!ex)return null;
  if(["tf","mcq","fill","story","cards","spot"].includes(ex.t)){
    const btns=[...doc.querySelectorAll("#qwrap .choice")];
    const good=btns.find(b=>{const r=b.dataset.v;return ex.t==="tf"?((r==="1")===ex.a):(parseInt(r)===ex.a);});
    click(correct?good:btns.find(b=>b!==good));
  }else if(ex.t==="num"){const i=doc.querySelector("#numin");i.value=correct?String(ex.a):"-9";i.dispatchEvent(new w.Event("input",{bubbles:true}));}
  else if(ex.t==="tiles"||ex.t==="eq"){const sel=ex.t==="eq"?".chip":".tile";
    (correct?ex.a:[...ex.a].reverse()).forEach(x=>click([...doc.querySelectorAll("#bank "+sel)].find(b=>!b.classList.contains("used")&&b.textContent===x)));}
  else if(ex.t==="match"){ex.p.forEach((pr,i)=>{const t=correct?pr[1]:ex.p[(i+1)%ex.p.length][1];
    click([...doc.querySelectorAll('[id^="ml"]')].find(b=>b.textContent===pr[0]&&!b.classList.contains("good")));
    click([...doc.querySelectorAll('[id^="mr"]')].find(b=>b.textContent===t&&!b.classList.contains("good")));});
    if(doc.querySelector("#btn-check").disabled)ex.p.forEach(pr=>{
      click([...doc.querySelectorAll('[id^="ml"]')].find(b=>b.textContent===pr[0]&&!b.classList.contains("good")));
      click([...doc.querySelectorAll('[id^="mr"]')].find(b=>b.textContent===pr[1]&&!b.classList.contains("good")));});}
  else if(ex.t==="order"){for(let p=0;p<60;p++){const o=w.eval("A.order.slice()");let sw=false;
    for(let i=0;i<o.length-1;i++){if(o[i]>o[i+1]){w.eval("moveO("+i+",1)");sw=true;break;}}if(!sw)break;}
    if(!correct)w.eval("moveO(0,1)");}
  else if(ex.t==="range"){(correct?ex.sel:["AA"]).forEach(n=>{const c=[...doc.querySelectorAll("#qwrap .rcell")].find(b=>b.dataset.h===n);if(c)click(c);});}
  else if(ex.t==="pick"){(correct?ex.a:[0]).forEach(k=>click(doc.querySelectorAll("#qwrap .pcardbtn")[k]));}
  const b=doc.querySelector("#btn-check");
  if(b.disabled){errs.push("bloqué "+ex.i+" ("+ex.t+")");return false;}
  click(b); click(doc.querySelector("#btn-check"));
  return true;
}
function runCalib(correct,label){
  w.eval("S.courses.POKER.calibrated=false;S.courses.POKER.lessons={};startCalib('POKER')");
  const n=w.eval("L.queue.length");
  let cnt=0;
  while(w.eval("L") && cnt<40){ if(!answerCur(correct))break; cnt++; }
  const st=w.eval("JSON.stringify({cal:S.courses.POKER.calibrated,lv:S.courses.POKER.level,lecons:Object.keys(S.courses.POKER.lessons).length})");
  console.log(" ",label,"| questions:",n,"| résultat:",st);
  const m=doc.querySelector("#modal .modalbox, #modal")?.textContent.replace(/\s+/g," ")||"";
  console.log("   modale:", m.slice(0,150).trim());
  w.eval("closeModal();quitLesson()");
}
runCalib(true,"toutes bonnes réponses");
runCalib(false,"toutes mauvaises réponses");

// --- rendus poker ---
w.eval("S.courses.POKER.calibrated=true;S.courses.POKER.level=2;save();setCourse('POKER')");
console.log("chemin poker: unités",doc.querySelectorAll("#pathbody .unitbar").length,
  "| noeuds",doc.querySelectorAll("#pathbody .node").length,
  "| bandeau niveau:", /Niveau évalué/.test(doc.querySelector("#pathbody").textContent));
w.eval("S.seenNotions=EXOS.map(e=>e.i)");
w.eval("L={uid:43,li:0,cid:'POKER',mode:'test',queue:[EXOS.find(e=>e.t==='cards')],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[],lv:{}};show('lesson');nextQ()");
if(doc.querySelector(".splash"))click(doc.querySelector(".splash #sp-go"));
console.log("cartes affichées:",doc.querySelectorAll("#qwrap .pcard").length);
w.eval("L.queue=[EXOS.find(e=>e.t==='spot')];L.idx=0;nextQ()");
if(doc.querySelector(".splash"))click(doc.querySelector(".splash #sp-go"));
console.log("table:",!!doc.querySelector("#qwrap .ptable"),"| sièges:",doc.querySelectorAll("#qwrap .seat").length,
  "| boutons d'action:",doc.querySelectorAll("#qwrap .actb").length);
w.eval("L.queue=[EXOS.find(e=>e.t==='range')];L.idx=0;nextQ()");
if(doc.querySelector(".splash"))click(doc.querySelector(".splash #sp-go"));
console.log("grille de range:",doc.querySelectorAll("#qwrap .rcell").length,"cases");
const aa=[...doc.querySelectorAll("#qwrap .rcell")][0];
console.log("case 0 =",aa.dataset.h,"| case 12 =",[...doc.querySelectorAll("#qwrap .rcell")][12].dataset.h,
  "| case 168 =",[...doc.querySelectorAll("#qwrap .rcell")][168].dataset.h);
w.eval("L.queue=[EXOS.find(e=>e.t==='pick')];L.idx=0;nextQ()");
if(doc.querySelector(".splash"))click(doc.querySelector(".splash #sp-go"));
console.log("cartes cliquables:",doc.querySelectorAll("#qwrap .pcardbtn").length);
console.log("ERREURS:",errs.length,errs.slice(0,6));
process.exit(0);
