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
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement/.test(e.message))errs.push(e.message.slice(0,180))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc});
const w=dom.window,doc=w.document;
w.HTMLMediaElement.prototype.play=()=>Promise.resolve();
w.HTMLMediaElement.prototype.pause=()=>{};
const click=el=>el&&el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
click(doc.querySelector("#ob-go"));
const types=w.eval("(()=>{const c={};EXOS.forEach(e=>c[e.t]=(c[e.t]||0)+1);return JSON.stringify(c)})()");
console.log("exos par type:",types,"| total",w.eval("EXOS.length"));
console.log("cours:",w.eval("COURSES.map(c=>c.id+':'+courseUnits(c.id).length+'u/'+courseUnits(c.id).reduce((n,u)=>n+unitExos(u.id).length,0)+'e').join(' | ')"));
console.log("ids dupliqués:",w.eval("(()=>{const s={},d=[];EXOS.forEach(e=>{if(s[e.i])d.push(e.i);s[e.i]=1});return d.join(',')||'aucun'})()"));
console.log("orphelins:",w.eval("EXOS.filter(e=>!UNITS.find(u=>u.id===e.u)).map(e=>e.i).join(',')||'aucun'"));
console.log("structure:",w.eval(`(()=>{const bad=[];EXOS.forEach(e=>{
 const need={mcq:['o','a'],fill:['o','a'],story:['o','a','sc'],tf:['a'],num:['a'],tiles:['a'],eq:['a'],
   match:['p'],order:['it'],color:['cols','a'],outfit:['items','a'],
   cards:['o','a','hand'],spot:['o','a','hand'],range:['sel'],pick:['cards','a'],
   dames:['o','a','pos'],move:['pos','a','side'],look:['slots'],
   studio:['o','a'],curve:['pts','zones','a'],thumb:['thumbs','a'],slider:['min','max','a']}[e.t];
 if(!need){bad.push(e.i+':type '+e.t);return;}
 need.forEach(k=>{if(e[k]===undefined)bad.push(e.i+':manque '+k);});
 if(['mcq','fill','story','cards','spot','dames','studio'].includes(e.t)&&e.o&&e.a>=e.o.length)bad.push(e.i+':index');
 if(e.t==='thumb'&&e.a>=e.thumbs.length)bad.push(e.i+':index');
 if(e.t==='curve'&&e.a>=e.zones.length)bad.push(e.i+':index');
 if(e.t==='slider'&&(e.a<e.min||e.a>e.max))bad.push(e.i+':hors bornes');
 if(e.t==='pick'&&e.a.some(k=>k>=e.cards.length))bad.push(e.i+':index carte');
 if(e.t==='range'&&e.sel.some(n=>!/^[2-9TJQKA]{2}[so]?$/.test(n)))bad.push(e.i+':main invalide');
 if(e.t==='color'&&e.a>=e.cols.length)bad.push(e.i+':index');
 if(e.t==='outfit'&&e.a>=e.items.length)bad.push(e.i+':index');
 if(e.t==='tf'&&typeof e.a!=='boolean')bad.push(e.i+':bool');
 if(e.t==='num'&&typeof e.a!=='number')bad.push(e.i+':nombre');
 if(!e.q)bad.push(e.i+':pas de question'); if(!e.w)bad.push(e.i+':pas d explication');
});return bad.slice(0,25).join(', ')||'aucune erreur'})()`));
function answer(ex,correct){
  if(["tf","mcq","fill","story","cards","spot","dames","studio"].includes(ex.t)){
    const btns=[...doc.querySelectorAll("#qwrap .choice")];
    const good=btns.find(b=>{const r=b.dataset.v;return ex.t==="tf"?((r==="1")===ex.a):(parseInt(r)===ex.a);});
    click(correct?good:btns.find(b=>b!==good));
  }else if(ex.t==="color"||ex.t==="outfit"){
    const sel=ex.t==="color"?".swcard":".fitcard";
    const btns=[...doc.querySelectorAll("#qwrap "+sel)];
    const good=btns.find(b=>parseInt(b.dataset.v)===ex.a);
    click(correct?good:btns.find(b=>b!==good));
  }else if(ex.t==="num"){const i=doc.querySelector("#numin");i.value=correct?String(ex.a):"-99999";
    i.dispatchEvent(new w.Event("input",{bubbles:true}));}
  else if(ex.t==="tiles"||ex.t==="eq"){
    const sel=ex.t==="eq"?".chip":".tile";
    (correct?ex.a:[...ex.a].reverse()).forEach(x=>{
      const t=[...doc.querySelectorAll("#bank "+sel)].find(b=>!b.classList.contains("used")&&b.textContent===x);
      click(t);});}
  else if(ex.t==="match"){ex.p.forEach((pr,i)=>{
      const tgt=correct?pr[1]:ex.p[(i+1)%ex.p.length][1];
      click([...doc.querySelectorAll('[id^="ml"]')].find(b=>b.textContent===pr[0]&&!b.classList.contains("good")));
      click([...doc.querySelectorAll('[id^="mr"]')].find(b=>b.textContent===tgt&&!b.classList.contains("good")));});
    if(doc.querySelector("#btn-check").disabled){ex.p.forEach(pr=>{
      click([...doc.querySelectorAll('[id^="ml"]')].find(b=>b.textContent===pr[0]&&!b.classList.contains("good")));
      click([...doc.querySelectorAll('[id^="mr"]')].find(b=>b.textContent===pr[1]&&!b.classList.contains("good")));});}}
  else if(ex.t==="thumb"){ const b=[...doc.querySelectorAll("#qwrap .thumbcard")];
      const g=b.find(x=>parseInt(x.dataset.v)===ex.a); click(correct?g:b.find(x=>x!==g));}
  else if(ex.t==="curve"){ w.eval("retTap("+(correct?ex.a:(ex.a+1)%ex.zones.length)+")");}
  else if(ex.t==="slider"){ w.eval("sliderMove("+(correct?ex.a:ex.min)+")");}
  else if(ex.t==="look"){ ex.slots.forEach((sl,si)=>{
      const k=correct?sl.a:(sl.a+1)%sl.items.length;
      click(doc.querySelector('#qwrap .fitcard[data-s="'+si+'"][data-v="'+k+'"]'));});}
  else if(ex.t==="move"){ const mv=(Array.isArray(ex.a)?ex.a[0]:ex.a).split("-").map(Number);
      (correct?mv:[mv[0],mv[0]]).forEach(n=>w.eval("damesTap("+n+")"));}
  else if(ex.t==="range"){ (correct?ex.sel:["AA"]).forEach(n=>{
      const c=[...doc.querySelectorAll("#qwrap .rcell")].find(b=>b.dataset.h===n); if(c)click(c);});}
  else if(ex.t==="pick"){ (correct?ex.a:[0]).forEach(k=>click(doc.querySelectorAll("#qwrap .pcardbtn")[k]));}
  else if(ex.t==="order"){for(let p=0;p<60;p++){const o=w.eval("A.order.slice()");let sw=false;
      for(let i=0;i<o.length-1;i++){if(o[i]>o[i+1]){w.eval("moveO("+i+",1)");sw=true;break;}}if(!sw)break;}}
  const b=doc.querySelector("#btn-check");
  if(b.disabled){errs.push("bouton bloqué "+ex.i+" ("+ex.t+")");return null;}
  click(b);
  const good=doc.querySelector("#checkbar").className.includes("good");
  if(correct&&!good)errs.push("bonne réponse refusée: "+ex.i+" ("+ex.t+")");
  return good;
}
const ONLY=process.env.CID||"";
const all=w.eval(ONLY?`courseUnits("${ONLY}").flatMap(u=>unitExos(u.id)).map(e=>e.i)`:"EXOS.map(e=>e.i)");
let played=0;
w.eval("S.settings.hearts=false;S.admin=true");
for(const id of all){
  w.eval(`L={uid:0,li:0,cid:"MRC",mode:"test",queue:[EXOS.find(e=>e.i===${JSON.stringify(id)})],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[]};show("lesson");nextQ();`);
  const sp=doc.querySelector(".splash"); if(sp)click(sp.querySelector("#sp-go"));
  const ex=w.eval("A&&A.ex");
  if(!ex){errs.push("pas de rendu pour "+id);continue;}
  answer(ex,true); played++;
}
console.log("exercices joués:",played);
w.eval(`L={uid:1,li:0,cid:"MRC",mode:"test",queue:[EXOS.find(e=>e.t==='num')],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[]};show("lesson");nextQ();`);
console.log("bouton calculatrice:",!!doc.getElementById("calc-fab"));
w.eval("openCalc()");
"97/1.05".split("").forEach(c=>w.eval(`calcKey(${JSON.stringify(c)})`));
w.eval("calcEq()");
console.log("97/1.05 =",doc.getElementById("calc-res").textContent);
console.log("insertion:",doc.getElementById("calc-use").textContent.trim().slice(0,45));
w.eval("calcUse()");
console.log("champ rempli:",doc.getElementById("numin").value);
w.eval("openCalc();calcClear();['l','n','(','2','5','.','3','2','/','3','0'].forEach(c=>calcKey(c));calcEq()");
console.log("ln(25.32/30) =",doc.getElementById("calc-res").textContent);
let plays=0; w.sfx=k=>{if(k==="click")plays++;};
doc.querySelector(".navitem").dispatchEvent(new w.MouseEvent("pointerdown",{bubbles:true}));
console.log("son de clic:",plays>0,"| chargé:",w.eval("!!window.__SND.click"));
console.log("exos avec énoncé:",w.eval("EXOS.filter(e=>e.ctx).length"));
console.log("ERREURS:",errs.length,errs.slice(0,10));
process.exit(0);
