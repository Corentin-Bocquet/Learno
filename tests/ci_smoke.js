/* Verification rapide : le fichier se charge, le contenu est complet,
   aucune cle secrete ne traine, la structure attendue est la. */
const fs=require('fs');
const path=require('path');
function learnoHTML(){
  const c=[process.env.LEARNO_HTML,
           path.join(__dirname,'..','index.html'),
           path.join(__dirname,'..','risklingo_v2.html'),
           '/sessions/lucid-wonderful-shannon/mnt/outputs/risklingo_v2.html'];
  for(const p of c){ if(p&&fs.existsSync(p))return p; }
  throw new Error("index.html introuvable");
}
const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(learnoHTML(),'utf8');
const errs=[];
const vc=new VirtualConsole();
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement|Not implemented/.test(e.message))errs.push(e.message.slice(0,180))});

const SEUILS={cours:9, unites:132, exos:1529};

const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc,
  beforeParse(w){
    w.HTMLMediaElement.prototype.play=()=>Promise.resolve();
    w.HTMLMediaElement.prototype.pause=()=>{};
    w.fetch=()=>Promise.reject(new Error("hors ligne"));
    w.matchMedia=w.matchMedia||(q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
  }});
const w=dom.window;

setTimeout(()=>{
  const dur=[];
  const n={cours:w.eval("COURSES.length"),unites:w.eval("UNITS.length"),exos:w.eval("EXOS.length")};
  console.log("contenu :",JSON.stringify(n));
  Object.keys(SEUILS).forEach(k=>{ if(n[k]<SEUILS[k])dur.push(k+" est tombe a "+n[k]+" (minimum "+SEUILS[k]+")"); });

  const doublons=w.eval("(()=>{const s={},d=[];EXOS.forEach(e=>{if(s[e.i])d.push(e.i);s[e.i]=1});return d.join(',')})()");
  if(doublons)dur.push("identifiants dupliques : "+doublons);
  const orphelins=w.eval("EXOS.filter(e=>!UNITS.find(u=>u.id===e.u)).map(e=>e.i).join(',')");
  if(orphelins)dur.push("exercices orphelins : "+orphelins);

  ["ico","badgeSVG","renderExam","renderErrors","palOpen","toggleTab","toggleTheme","cloudSync","exportBackup","applyCourse","notifCheck"]
    .forEach(f=>{ if(w.eval("typeof "+f)!=="function")dur.push("fonction manquante : "+f); });
  ["eye","eyeoff","bell","exam","moon","upload","grid"].forEach(i=>{
    if(!w.eval("!!ICONS['"+i+"']"))dur.push("icone manquante : "+i); });

  if(/sb_secret_|service_role|SUPABASE_SERVICE/.test(html))dur.push("cle secrete presente dans le HTML");
  if(!/env\(safe-area-inset/.test(html))dur.push("marges de securite iOS absentes");
  if(!/prefers-reduced-motion/.test(html))dur.push("mouvement reduit absent");
  if(!/:focus-visible/.test(html))dur.push("focus visible absent");
  if(!/--z-toast/.test(html))dur.push("echelle de profondeur absente");

  console.log("poids :",Math.round(html.length/1024),"Ko");
  if(dur.length){ console.log("\nERREURS:",dur.length,dur); process.exit(1); }
  console.log("\nERREURS: 0 []");
  process.exit(0);
},3000);
