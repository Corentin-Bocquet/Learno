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
const vc=new VirtualConsole();
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc});
const w=dom.window;
w.HTMLMediaElement.prototype.play=()=>Promise.resolve();w.HTMLMediaElement.prototype.pause=()=>{};
console.log(w.eval(`["STYLE","HUMOUR","POKER","DAMES"].map(cid=>cid+" : "+courseUnits(cid).map(u=>{
  const ex=unitExos(u.id); const p=ex.filter(isPractice).length;
  return u.id+"("+p+"/"+ex.length+")";
}).join(" ")).join("\\n\\n")`));
process.exit(0);
