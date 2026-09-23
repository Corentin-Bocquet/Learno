/* Cours PATRI et fonctions ajoutees avec lui : categories, boutique,
   niveaux d'examen, revisions inter-modules, ligue en ligne.
   Garde-fous de la charte de redaction : 8 lecons par module, formats
   varies, aucune bonne reponse reperable a sa longueur. */
const fs=require('fs');const path=require('path');
const {JSDOM,VirtualConsole}=(()=>{try{return require('jsdom')}catch(e){return require('/tmp/node_modules/jsdom')}})();
const html=fs.readFileSync(process.env.LEARNO_HTML||path.join(__dirname,'..','index.html'),'utf8');
const errs=[];const vc=new VirtualConsole();
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement|Not implemented/.test(e.message))errs.push("jsdom: "+e.message.slice(0,160))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc,
  beforeParse(w){ w.HTMLMediaElement.prototype.play=()=>Promise.resolve(); w.HTMLMediaElement.prototype.pause=()=>{};
    w.fetch=()=>Promise.reject(new Error("hors ligne")); }});
const w=dom.window, E=x=>w.eval(x);
const ko=m=>errs.push(m);

setTimeout(()=>{
  E("S.onboarded=true;S.settings.hearts=false");
  /* ---------- 1. structure du cours ---------- */
  const U=JSON.parse(E("JSON.stringify(courseUnits('PATRI').map(u=>({id:u.id,t:u.t,n:unitExos(u.id).length,l:lessonsIn(u.id),g:(u.guide||'').length})))"));
  const MIN_U=+(process.env.PATRI_MIN_UNITS||16);
  if(U.length<MIN_U)ko("PATRI : "+U.length+" modules (minimum "+MIN_U+")");
  U.forEach(u=>{
    if(u.n!==32)ko("module "+u.id+" : "+u.n+" exercices au lieu de 32");
    if(u.l!==8)ko("module "+u.id+" : "+u.l+" leçons au lieu de 8");
    if(u.g<2500)ko("module "+u.id+" : guide trop court ("+u.g+" caractères)");
  });
  const X=JSON.parse(E("JSON.stringify(EXOS.filter(e=>unitOf(e.u)&&unitOf(e.u).c==='PATRI'))"));
  console.log("PATRI :",U.length,"modules,",X.length,"exercices");

  /* ---------- 2. variete des formats ---------- */
  U.forEach(u=>{
    const l=X.filter(e=>e.u===u.id), types=new Set(l.map(e=>e.t));
    const st=l.filter(e=>e.t==="story").length, mc=l.filter(e=>e.t==="mcq").length;
    if(types.size<8)ko("module "+u.id+" : seulement "+types.size+" formats différents");
    if(st<4)ko("module "+u.id+" : seulement "+st+" conversations client");
    if(mc>8)ko("module "+u.id+" : trop de QCM classiques ("+mc+")");
  });
  const parType={}; X.forEach(e=>parType[e.t]=(parType[e.t]||0)+1);
  console.log("formats :",JSON.stringify(parType));

  /* ---------- 3. la bonne reponse ne se devine pas a sa longueur ---------- */
  const ch=X.filter(e=>["mcq","fill","story"].includes(e.t));
  let plusLongue=0, ratios=[];
  ch.forEach(e=>{
    const L=e.o.map(x=>x.length), bon=L[e.a], autres=L.filter((_,k)=>k!==e.a);
    if(autres.every(x=>bon>x))plusLongue++;
    ratios.push(bon/(autres.reduce((a,b)=>a+b,0)/autres.length));
  });
  const part=ch.length?plusLongue/ch.length:0, moy=ratios.length?ratios.reduce((a,b)=>a+b,0)/ratios.length:1;
  console.log("bonne réponse strictement la plus longue :",Math.round(part*100)+"% ("+plusLongue+"/"+ch.length+") | ratio moyen de longueur :",moy.toFixed(2));
  if(part>0.34)ko("la bonne réponse est la plus longue dans "+Math.round(part*100)+"% des cas (maximum 34%)");
  if(ch.length>=40&&part<0.12)ko("la bonne réponse n'est presque jamais la plus longue ("+Math.round(part*100)+"%) : c'est aussi un indice");
  if(moy>1.12)ko("les bonnes réponses sont en moyenne "+Math.round((moy-1)*100)+"% plus longues que les autres");
  /* position : le moteur melange, mais on verifie qu aucune donnee ne trahit */
  const poids=[0,0,0,0,0]; ch.forEach(e=>poids[e.a]++);

  /* ---------- 4. qualite de redaction ---------- */
  const vus={};
  X.forEach(e=>{
    const k=(e.q+"|"+(e.ctx||"")+"|"+JSON.stringify(e.sc||"")).toLowerCase();
    if(vus[k])ko("question en double : "+e.i+" et "+vus[k]); vus[k]=e.i;
    if(!e.w||e.w.length<40)ko("explication trop courte : "+e.i);
    const txt=JSON.stringify(e);
    if(/\u2014/.test(txt))ko("tiret cadratin interdit : "+e.i);
    if(e.o&&new Set(e.o).size!==e.o.length)ko("propositions identiques : "+e.i);
    if(e.t==="multi"&&e.a.length===e.o.length)ko("toutes les cases sont justes : "+e.i);
    if(e.t==="sort"&&new Set(e.it.map(x=>x[1])).size<2)ko("classement à une seule case : "+e.i);
  });
  U.forEach(u=>{ const g=E(`unitOf(${u.id}).guide`); if(/\u2014/.test(g))ko("tiret cadratin dans le guide "+u.id);
    if(!/gmnemo/.test(g))ko("module "+u.id+" : pas de moyen mnémotechnique");
    if(!/gstory/.test(g))ko("module "+u.id+" : pas de mise en situation"); });

  /* ---------- 5. revisions inter-modules ---------- */
  if(U.length>=2){
    E(`courseUnits('PATRI')[0]&&unitExos(courseUnits('PATRI')[0].id).forEach(e=>{S.items[e.i]={n:1,c:1,hl:1,ts:Date.now()-864e5*3,d:null};})`);
    const q=JSON.parse(E(`JSON.stringify(buildLesson(courseUnits('PATRI')[1].id,0).queue.map(e=>e.u))`));
    const anciens=q.filter(u=>u===U[0].id).length;
    console.log("leçon 1 du module 2 :",q.length,"questions dont",anciens,"rappel(s) du module 1");
    if(q.length!==7)ko("une leçon PATRI doit faire 7 questions, pas "+q.length);
    if(anciens<2)ko("pas assez de rappels des modules précédents ("+anciens+")");
    const neuves=JSON.parse(E(`JSON.stringify(buildLesson(courseUnits('PATRI')[1].id,3).queue.map(e=>e.i))`));
    const attendu=JSON.parse(E(`JSON.stringify(unitExos(courseUnits('PATRI')[1].id).slice(12,16).map(e=>e.i))`));
    if(!attendu.every(i=>neuves.includes(i)))ko("la leçon 4 ne contient pas ses 4 questions neuves");
  }
  /* les autres cours ne bougent pas : toujours l ancien tirage */
  const mrc=JSON.parse(E(`JSON.stringify(buildLesson(1,0).queue.map(e=>e.u))`));
  if(mrc.some(u=>u!==1))ko("le tirage du cours MRC a changé");

  /* ---------- 6. categories ---------- */
  E("setTab('courses')");
  const tuiles=w.document.querySelectorAll("#coursesbody .cattile").length;
  console.log("familles de cours :",tuiles,"|",E("catList().map(c=>c.nm+':'+catCourses(c.id).map(x=>x.id).join('+')).join(' | ')"));
  if(tuiles<4)ko("les familles de cours ne s'affichent pas");
  if(E("catOf('PATRI').id")!=="ecole"||E("catOf('MRC').id")!=="ecole"||E("catOf('BANQUE').id")!=="ecole"||E("catOf('RISK').id")!=="ecole")ko("PATRI, MRC, BANQUE et RISK doivent être dans École");
  if(E("catOf('POKER').id")!=="jeux"||E("catOf('DAMES').id")!=="jeux")ko("poker et dames doivent être dans Jeux");
  E("openCat('jeux')");
  const lignes=w.document.querySelectorAll("#coursesbody .courseline").length;
  if(lignes!==2)ko("la famille Jeux devrait afficher 2 cours, pas "+lignes);

  /* ---------- 7. boutique ---------- */
  E("setTab('shop')");
  if(!w.document.getElementById("sc-shop").classList.contains("on"))ko("l'onglet Boutique ne s'ouvre pas");
  E("S.gems=500;S.inv={};S.boost=null;buyPotion('p2')");
  if(E("S.gems")!==400||E("S.inv.p2")!==1)ko("achat de potion incorrect");
  E("drinkPotion('p2')");
  if(E("boostMult()")!==2)ko("la potion ×2 ne s'active pas");
  E(`L=buildLesson(courseUnits('PATRI')[0].id,0);L.wrong=1;L.ok=6;L.maxCombo=0;window.__av=S.xp;finish()`);
  const gain=E("S.xp-window.__av");
  console.log("XP d'une leçon sous potion ×2 :",gain);
  if(gain!==20)ko("la potion ×2 devrait donner 20 XP sur une leçon imparfaite, pas "+gain);
  E("closeModal();S.boost={m:3,until:Date.now()+1000,id:'p3'};drinkPotion('p2')");
  if(E("S.boost.m")!==3)ko("une potion plus faible ne doit pas écraser une plus forte");

  /* ---------- 8. niveaux d'examen ---------- */
  const niv=JSON.parse(E("JSON.stringify(EXAM_LVL.map(l=>l.n))"));
  if(JSON.stringify(niv)!=="[[10,20,30],[15,40,60],[30,60,100]]")ko("niveaux d'examen inattendus : "+JSON.stringify(niv));
  if(JSON.stringify(JSON.parse(E("JSON.stringify(EXAM_FMT.map(f=>f.min))")))!=="[8,20,35]")ko("les durées d'examen ont changé");
  if(X.length>=100){
    E("S.active='PATRI';setExamLvl(2);examStart('PATRI',2)");
    const n=E("L&&L.queue.length");
    console.log("examen difficile complet :",n,"questions en",E("L.exam.limit/60000"),"minutes");
    if(n!==100)ko("l'examen difficile complet doit faire 100 questions, pas "+n);
    E("examQuit()");
  }

  /* ---------- 9. ligue en ligne : sans serveur, rien ne change ---------- */
  const avant=E("leagueRows().length");
  E("LG_REMOTE=[{user_id:'x',name:'Amie',xp_week:999,avatar:null}]");
  const apres=JSON.parse(E("JSON.stringify(leagueRows().map(r=>({n:r.n,live:!!r.live,me:!!r.me})))"));
  if(apres.length!==avant)ko("un vrai joueur doit remplacer un personnage fictif, pas s'ajouter");
  if(!apres.find(r=>r.live&&r.n==="Amie"))ko("le vrai joueur n'apparaît pas dans la ligue");
  if(!apres.find(r=>r.me))ko("le joueur a disparu de sa propre ligue");
  E("LG_REMOTE=[]");

  /* ---------- 10. aucun emoji dans les scripts charges apres le demarrage ----------
     startEmojiWatch() remplace les emoji de tout texte ajoute au document, y compris
     le contenu d'une balise script pas encore executee : le script est alors vide
     et ne s'execute jamais, sans la moindre erreur. On ecrit les emoji en \u{...}. */
  const EMRE=w.eval("EM_RE"), morceaux=html.split("<script>"); let apresBoot=false;
  morceaux.forEach((m,i)=>{ if(!i)return; const corps=m.split("</script>")[0];
    if(/\nboot\(\);/.test(corps)){apresBoot=true;return;}
    EMRE.lastIndex=0;
    if(apresBoot&&EMRE.test(corps))ko("un script chargé après boot() contient un emoji littéral : "+(corps.match(/\/\*[\s\S]*?\*\//)||[""])[0].split("\n")[1]);
  });
  if(w.eval("typeof buyPotion")!=="function")ko("le script de la boutique ne s'est pas exécuté");

  if(errs.length){ console.log("\nERREURS:",errs.length,errs.slice(0,40)); process.exit(0); }
  console.log("\nERREURS: 0 []"); process.exit(0);
},3000);
