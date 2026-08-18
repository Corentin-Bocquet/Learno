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
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement/.test(e.message))errs.push(e.message.slice(0,160))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc});
const w=dom.window,doc=w.document;
w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};
const click=el=>el&&el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
click(doc.querySelector("#ob-go"));
// progression existante
w.eval("S.courses.MRC.lessons['1-0']=3;S.courses.POKER.calibrated=true;S.courses.POKER.level=3;S.xp=1234;save();load()");
console.log("progression conservée: MRC",w.eval("S.courses.MRC.lessons['1-0']"),"| poker niveau",w.eval("S.courses.POKER.level"),"| XP",w.eval("S.xp"));
console.log("cours:",w.eval("COURSES.map(c=>c.id+'('+courseUnits(c.id).length+'u/'+courseUnits(c.id).reduce((n,u)=>n+unitExos(u.id).length,0)+'e)').join(' ')"));
// bandeau de calibrage dames
w.eval("setCourse('DAMES')");
console.log("test de niveau proposé:", /Où en es-tu vraiment/.test(doc.querySelector("#pathbody").textContent));
console.log("questions de calibrage:", w.eval("calibPool('DAMES').length"),
  "| par niveau:", w.eval("JSON.stringify([1,2,3,4,5].map(l=>EXOS.filter(e=>e.lv===l&&courseUnits('DAMES').map(u=>u.id).includes(e.u)).length))"));
// damier
w.eval("S.seenNotions=EXOS.map(e=>e.i)");
w.eval("L={uid:60,li:0,cid:'DAMES',mode:'test',queue:[EXOS.find(e=>e.i==='60a')],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[],lv:{}};show('lesson');nextQ()");
console.log("damier:",doc.querySelectorAll("#qwrap .dsq").length,"cases |",doc.querySelectorAll("#qwrap .dsq.dark").length,"foncées |",
  doc.querySelectorAll("#qwrap .pion").length,"pions |",doc.querySelectorAll("#qwrap .pion.pw").length,"blancs");
// numérotation
const nums=[...doc.querySelectorAll("#qwrap .dsq.dark")].map(d=>+d.dataset.n);
console.log("numérotation 1..50:",nums[0],"->",nums[49],"| complète:",JSON.stringify(nums)===JSON.stringify([...Array(50)].map((_,i)=>i+1)));
console.log("pions noirs sur 1-20:",[...doc.querySelectorAll("#qwrap .pion.pb")].every(p=>+p.closest(".dsq").dataset.n<=20));
// jouer un coup
w.eval("L.queue=[EXOS.find(e=>e.i==='63b')];L.idx=0;nextQ()");
console.log("exercice rafle triple, cases interactives:",doc.querySelectorAll("#qwrap .dsq.dark[onclick]").length);
w.eval("damesTap(32)"); console.log("après clic 32:",doc.getElementById("mvlabel").textContent,"| bouton actif:",!doc.querySelector("#btn-check").disabled);
w.eval("damesTap(23);damesTap(14);damesTap(25)");
console.log("chemin construit:",doc.getElementById("mvlabel").textContent,"| bouton actif:",!doc.querySelector("#btn-check").disabled);
click(doc.querySelector("#btn-check"));
console.log("verdict:",doc.querySelector("#checkbar").className.includes("good")?"CORRECT":"faux","| solution affichée:",doc.querySelectorAll("#qwrap .dsq.sol, #qwrap .dsq.solstart").length,"cases");
// mauvais coup
w.eval("L.queue=[EXOS.find(e=>e.i==='63c')];L.idx=0;nextQ()");
w.eval("damesTap(33);damesTap(22)");
click(doc.querySelector("#btn-check"));
console.log("prise non maximale 33-22 :",doc.querySelector("#checkbar").className.includes("bad")?"REFUSÉE (correct)":"acceptée (bug)");
// calibrage complet
function answerCur(correct){
  const sp=doc.querySelector(".splash"); if(sp)click(sp.querySelector("#sp-go"));
  const ex=w.eval("A&&A.ex"); if(!ex)return null;
  if(["tf","mcq","fill","story","cards","spot","dames"].includes(ex.t)){
    const b=[...doc.querySelectorAll("#qwrap .choice")];
    const g=b.find(x=>{const r=x.dataset.v;return ex.t==="tf"?((r==="1")===ex.a):(parseInt(r)===ex.a);});
    click(correct?g:b.find(x=>x!==g));
  }else if(ex.t==="num"){const i=doc.querySelector("#numin");i.value=correct?String(ex.a):"-9";i.dispatchEvent(new w.Event("input",{bubbles:true}));}
  else if(ex.t==="move"){const mv=(Array.isArray(ex.a)?ex.a[0]:ex.a).split("-").map(Number);
    if(correct){mv.forEach(n=>w.eval("damesTap("+n+")"));}
    else{ w.eval("damesTap("+mv[0]+")");
      const free=[...doc.querySelectorAll("#qwrap .dsq.dark")].map(d=>+d.dataset.n)
        .filter(n=>!doc.getElementById("sq"+n).querySelector(".pion")&&!mv.includes(n));
      w.eval("damesTap("+free[0]+")"); }}
  else if(ex.t==="tiles"){(correct?ex.a:[...ex.a].reverse()).forEach(x=>click([...doc.querySelectorAll("#bank .tile")].find(b=>!b.classList.contains("used")&&b.textContent===x)));}
  else if(ex.t==="match"){ex.p.forEach((pr,i)=>{const t=correct?pr[1]:ex.p[(i+1)%ex.p.length][1];
    click([...doc.querySelectorAll('[id^="ml"]')].find(b=>b.textContent===pr[0]&&!b.classList.contains("good")));
    click([...doc.querySelectorAll('[id^="mr"]')].find(b=>b.textContent===t&&!b.classList.contains("good")));});
    if(doc.querySelector("#btn-check").disabled)ex.p.forEach(pr=>{
      click([...doc.querySelectorAll('[id^="ml"]')].find(b=>b.textContent===pr[0]&&!b.classList.contains("good")));
      click([...doc.querySelectorAll('[id^="mr"]')].find(b=>b.textContent===pr[1]&&!b.classList.contains("good")));});}
  else if(ex.t==="order"){for(let p=0;p<60;p++){const o=w.eval("A.order.slice()");let sw=false;
    for(let i=0;i<o.length-1;i++){if(o[i]>o[i+1]){w.eval("moveO("+i+",1)");sw=true;break;}}if(!sw)break;}
    if(!correct)w.eval("moveO(0,1)");}
  const b=doc.querySelector("#btn-check");
  if(b.disabled){errs.push("bloqué "+ex.i+" ("+ex.t+")");return false;}
  click(b); click(doc.querySelector("#btn-check")); return true;
}
[[true,"parfait"],[false,"nul"]].forEach(([c,lbl])=>{
  w.eval("S.courses.DAMES.calibrated=false;S.courses.DAMES.lessons={};startCalib('DAMES')");
  let n=0; while(w.eval("L")&&n<40){ if(!answerCur(c))break; n++; }
  console.log("calibrage",lbl,"->",w.eval("JSON.stringify({niveau:CALIB_LEVELS[S.courses.DAMES.level].n,modules:Object.keys(S.courses.DAMES.lessons).length})"));
  w.eval("closeModal();quitLesson()");
});
console.log("ERREURS:",errs.length,errs.slice(0,6));
process.exit(0);
