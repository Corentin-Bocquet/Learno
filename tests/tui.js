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
console.log("titre:",doc.title,"| logo:",doc.querySelector("#side .logo")?.textContent.trim());
["path","league","quests","habits","review","courses","profile","tasks"].forEach(t=>{
  w.eval(`setTab('${t}')`);
  console.log(" ",t,"->",doc.querySelector(".screen.on")?.id,"|",doc.querySelector(".screen.on").textContent.replace(/\s+/g," ").trim().length,"car.");
});
["MRC","BANQUE","STYLE","HUMOUR"].forEach(c=>{
  w.eval(`setCourse('${c}')`);
  const n=doc.querySelectorAll("#pathbody .node").length;
  const ch=doc.querySelectorAll("#pathbody .node.chest").length;
  console.log(" ",c,"noeuds",n,"coffres",ch,"unités",doc.querySelectorAll("#pathbody .unitbar").length);
});
w.eval("openGuide(33)");
console.log("guide humour:",doc.querySelector("#modal .ghero h2")?.textContent,"| sections:",doc.querySelectorAll("#modal .gsec").length);
w.eval("closeModal()");
// splash nouvelle notion
w.eval("S.seenNotions=[];L={uid:33,li:0,cid:'HUMOUR',mode:'test',queue:[EXOS.find(e=>e.i==='33a')],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[]};show('lesson');nextQ()");
console.log("splash affiché:",!!doc.querySelector(".splash"),"|",doc.querySelector(".splash")?.textContent.replace(/\s+/g," ").trim().slice(0,50));
click(doc.querySelector(".splash #sp-go"));
console.log("après splash, question:",doc.querySelector("#qwrap .qkind")?.textContent);
// vêtements et couleurs
w.eval("L={uid:25,li:0,cid:'STYLE',mode:'test',queue:[EXOS.find(e=>e.t==='outfit')],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[]};nextQ()");
console.log("cartes vêtements:",doc.querySelectorAll("#qwrap .fitcard").length,"| svg:",doc.querySelectorAll("#qwrap .fitcard svg").length);
w.eval("L.queue=[EXOS.find(e=>e.t==='color')];L.idx=0;nextQ()");
console.log("nuanciers:",doc.querySelectorAll("#qwrap .swcard").length);
w.eval("L.queue=[EXOS.find(e=>e.t==='eq')];L.idx=0;nextQ()");
console.log("briques de formule:",doc.querySelectorAll("#qwrap .chip").length);
w.eval("L.queue=[EXOS.find(e=>e.t==='story')];L.idx=0;nextQ()");
console.log("répliques:",doc.querySelectorAll("#qwrap .sline").length,"| avatars:",doc.querySelectorAll("#qwrap .savt svg").length);
w.eval("L.queue=[EXOS.find(e=>e.ctx)];L.idx=0;nextQ()");
console.log("encart énoncé:",!!doc.querySelector("#qwrap .ctxbox"));
const emo=(doc.body.textContent.match(/[\u{1F300}-\u{1FAFF}]/gu)||[]);
console.log("ERREURS:",errs.length,errs.slice(0,5));
process.exit(0);
