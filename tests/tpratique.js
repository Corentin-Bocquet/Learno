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
console.log("PART DE PRATIQUE DANS LE CONTENU");
w.eval("COURSES").forEach?0:0;
console.log(w.eval(`COURSES.map(c=>{
  const ex=courseUnits(c.id).flatMap(u=>unitExos(u.id));
  const p=ex.filter(isPractice).length;
  return "  "+c.id.padEnd(7)+" "+String(p).padStart(3)+"/"+String(ex.length).padEnd(4)+" = "+Math.round(100*p/ex.length)+" %"+(c.practice?"   [cours orienté pratique]":"");
}).join("\\n")`));
console.log("\nPART DE PRATIQUE DANS LES LEÇONS RÉELLEMENT SERVIES");
["STYLE","HUMOUR","POKER","DAMES","YT","RISK","NIETZ","MRC"].forEach(cid=>{
  let tot=0,prac=0,lessons=0;
  w.eval(`courseUnits("${cid}")`);
  const units=w.eval(`courseUnits("${cid}").map(u=>u.id)`);
  units.forEach(uid=>{
    const n=w.eval(`lessonsIn(${uid})`);
    for(let li=0;li<n;li++){
      const r=w.eval(`(()=>{const L=buildLesson(${uid},${li},"normal");
        return JSON.stringify({t:L.queue.length,p:L.queue.filter(isPractice).length})})()`);
      const o=JSON.parse(r); tot+=o.t; prac+=o.p; lessons++;
    }
  });
  console.log("  "+cid.padEnd(7)+lessons+" leçons | "+Math.round(100*prac/tot)+" % d'exercices pratiques");
});
console.log("\nTYPES IMMERSIFS PAR COURS");
console.log(w.eval(`["STYLE","HUMOUR","POKER","DAMES"].map(cid=>{
  const ex=courseUnits(cid).flatMap(u=>unitExos(u.id));
  const c={}; ex.forEach(e=>{if(["move","dames","spot","cards","range","pick","outfit","color","look","story"].includes(e.t))c[e.t]=(c[e.t]||0)+1;});
  return "  "+cid.padEnd(7)+JSON.stringify(c);
}).join("\\n")`));
// le type look fonctionne
w.eval("S.seenNotions=EXOS.map(e=>e.i)");
w.eval("L={uid:29,li:0,cid:'STYLE',mode:'test',queue:[EXOS.find(e=>e.t==='look')],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[],lv:{}};show('lesson');nextQ()");
console.log("\ncomposition de tenue :",doc.querySelectorAll("#qwrap .lookslot").length,"emplacements |",
  doc.querySelectorAll("#qwrap .fitcard").length,"pièces | énoncé:",!!doc.querySelector("#qwrap .ctxbox"),
  "| libellé:",doc.querySelector("#qwrap .ctxbox .ck")?.textContent);
const ex=w.eval("A.ex");
ex.slots.forEach((sl,si)=>click(doc.querySelector('#qwrap .fitcard[data-s="'+si+'"][data-v="'+sl.a+'"]')));
console.log("bouton actif après 4 choix:",!doc.querySelector("#btn-check").disabled);
click(doc.querySelector("#btn-check"));
console.log("verdict:",doc.querySelector("#checkbar").className.includes("good")?"CORRECT":"faux");
console.log("\nERREURS:",errs.length,errs.slice(0,5));
process.exit(0);
