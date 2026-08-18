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
const vc=new VirtualConsole(); vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement/.test(e.message))console.log("JSDOM ERR:",e.message.slice(0,300))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc});
const w=dom.window,doc=w.document;
w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};
const click=el=>el&&el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
click(doc.querySelector("#ob-go"));
console.log("cardSVG défini:",w.eval("typeof cardSVG"),"| pokerTable:",w.eval("typeof pokerTable"),"| rangeGrid:",w.eval("typeof rangeGrid"),"| CALIB_LEVELS:",w.eval("typeof CALIB_LEVELS"));
w.eval("S.seenNotions=EXOS.map(e=>e.i)");
w.eval("L={uid:43,li:0,cid:'POKER',mode:'test',queue:[EXOS.find(e=>e.i==='43a')],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[],lv:{}};show('lesson');nextQ()");
console.log("qwrap html (300):",doc.querySelector("#qwrap").innerHTML.slice(0,300).replace(/\n/g," "));
console.log("svg:",doc.querySelectorAll("#qwrap svg").length,"| .pcard:",doc.querySelectorAll("#qwrap .pcard").length,"| .choice:",doc.querySelectorAll("#qwrap .choice").length);
process.exit(0);
