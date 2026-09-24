/* Design Arcade : l accueil, le parcours en cartes et en chemin, les corrections
   avec memo, la fin de lecon et les cinq nouveaux jeux fonctionnent sur plusieurs
   cours, sans erreur JavaScript et sans toucher au contenu. */
const fs=require('fs'), path=require('path');
const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const errs=[], ko=m=>errs.push(m);
const vc=new VirtualConsole();
vc.on("jsdomError",e=>{if(!/getContext|HTMLMediaElement|Not implemented/.test(e.message))errs.push("jsdom: "+e.message.slice(0,180))});
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/",virtualConsole:vc,
  beforeParse(w){
    w.HTMLMediaElement.prototype.play=()=>Promise.resolve(); w.HTMLMediaElement.prototype.pause=()=>{};
    w.fetch=()=>Promise.reject(new Error("hors ligne"));
    w.matchMedia=w.matchMedia||(q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
  }});
const w=dom.window, doc=w.document, E=x=>w.eval(x);
const clic=el=>el&&el.dispatchEvent(new w.MouseEvent("click",{bubbles:true}));
const wait=ms=>new Promise(r=>setTimeout(r,ms));

(async()=>{
await wait(2500);
clic(doc.querySelector("#ob-go")); await wait(200);
E("if(typeof authSkip==='function')authSkip()"); await wait(100);

/* 1. le bloc de design, ses regles */
const bloc=(html.match(/<!-- DESIGN:ARCADE:DEBUT -->[\s\S]*?<!-- DESIGN:ARCADE:FIN -->/)||[""])[0];
if(!bloc)ko("bloc DESIGN:ARCADE absent");
if(/[\u{1F300}-\u{1FAFF}]/u.test(bloc))ko("emoji litteral dans le bloc de design");
if(bloc.includes("\u2014"))ko("tiret cadratin dans le bloc de design");
if(html.lastIndexOf("<!-- DESIGN:ARCADE:FIN -->")<html.lastIndexOf("<script>"))ko("le bloc de design n est pas la derniere couche");
console.log("classe arcade :",doc.body.classList.contains("arcade"));
if(!doc.body.classList.contains("arcade"))ko("classe arcade absente");

/* 2. onglets et barre du haut */
const noms=[...doc.querySelectorAll("#mtabs .navitem")].map(b=>b.getAttribute("aria-label")||"");
if([...doc.querySelectorAll("#mtabs .navitem")].some(b=>b.textContent.trim()))ko("la barre du bas affiche encore du texte sous les icones");
console.log("barre du bas :",noms.join(" | "));
["Jouer","Réviser","Ligue","Boutique","Plus"].forEach(n=>{ if(!noms.includes(n))ko("onglet absent : "+n); });
if(noms.length!==5)ko("la barre du bas doit compter 5 cases, pas "+noms.length);
E("moreTabs()"); await wait(40);
const plus=[...doc.querySelectorAll("#mcard .arc-more button")].map(b=>b.textContent.trim());
console.log("dans Plus :",plus.join(" | "));
["Défis","Profil"].forEach(n=>{ if(!plus.includes(n))ko("onglet introuvable dans Plus : "+n); });
E("closeModal()");
/* zones de securite iPhone, verre liquide, pas d ancien design au lancement */
if(!/#center\{padding-top:env\(safe-area-inset-top\)\}/.test(bloc))ko("marge du haut iPhone absente");
if(!/#mtabs\{[^}]*backdrop-filter/.test(bloc))ko("barre du bas sans verre liquide");
if(!/#mtabs\{z-index:60\}/.test(bloc))ko("la barre du bas peut passer sous les bandeaux de module");
if(!/<!-- DESIGN:ARCADE:TETE:DEBUT -->[\s\S]*arc-wait[\s\S]*<\/head>/.test(html))ko("masque de lancement absent de la tete");
if(doc.documentElement.classList.contains("arc-wait"))ko("la page reste masquee apres le chargement");
if(!doc.querySelector("#mt-course.arc-cpill"))ko("pastille du cours absente");
["mt-streak","mt-gems","mt-hearts","mt-xp"].forEach(i=>{ if(!doc.getElementById(i))ko("compteur disparu : "+i); });

/* 3. accueil et parcours, sur plusieurs cours */
for(const cid of ["PATRI","MRC","POKER","NUTRI"]){
  E(`S.active='${cid}';S.settings.pathView='cards';save();setTab('path')`); await wait(80);
  const b=doc.getElementById("pathbody");
  const cartes=b.querySelectorAll(".arc-mod").length, unites=E(`courseUnits('${cid}').length`);
  const sections=["arc-streak","arc-chestrow"].filter(c=>b.querySelector("."+c)).length;
  const jeux=b.querySelectorAll(".arc-play").length;
  if(cartes!==unites)ko(cid+" : "+cartes+" cartes pour "+unites+" modules");
  if(sections<2||jeux<4)ko(cid+" : accueil incomplet");
  if(b.querySelector('[onclick^="setCourse"]'))ko(cid+" : les puces de cours encombrent encore l accueil");
  E("arcView('snake')"); await wait(60);
  const noeuds=b.querySelectorAll(".node").length;
  if(!noeuds)ko(cid+" : chemin vide");
  if(E(`needsCalib('${cid}')`)&&!/Où en es-tu vraiment/.test(b.textContent))ko(cid+" : test de niveau masqué");
  console.log(" ",cid,"cartes",cartes,"| noeuds du chemin",noeuds,"| jeux",jeux);
  E("arcView('cards')");
}
E("arcCourses()"); await wait(60);
console.log("sélecteur de cours :",doc.querySelectorAll("#mcard .arc-crow").length,"cours");
if(doc.querySelectorAll("#mcard .arc-crow").length<10)ko("sélecteur de cours incomplet");
E("closeModal()");

/* 3 bis. la lecon s affiche avant le quiz, et on peut la passer */
E("S.active='MMA';save()");
const u1=E("courseUnits('MMA')[0].id");
E(`delete S.courses.MMA.lessons[lkey(${u1},0)];arcStart(${u1},0)`); await wait(40);
const intro=doc.getElementById("sc-intro");
console.log("leçon avant le quiz :",intro&&intro.classList.contains("on"),"|",(doc.querySelector("#introbody h2")||{}).textContent);
if(!intro||!intro.classList.contains("on"))ko("la leçon ne s'affiche pas avant le quiz");
if(!doc.querySelector("#introbody .arc-lesson")||doc.querySelector("#introbody .arc-lesson").textContent.trim().length<40)ko("leçon avant le quiz vide");
E("arcIntroGo()"); await wait(40);
if(!doc.getElementById("sc-lesson").classList.contains("on"))ko("Passer ne lance pas le quiz");
E("quitLesson()"); await wait(30);
/* le guide devient la lecon : objectifs, sommaire, parties repliables */
E(`openGuide(${u1})`); await wait(40);
const parts=doc.querySelectorAll("#mcard details.arc-acc").length;
console.log("leçon du module :",parts,"parties repliables | objectifs :",!!doc.querySelector("#mcard .arc-goals"));
if(parts<3)ko("guide non découpé en parties");
if(!doc.querySelector("#mcard .arc-goals"))ko("objectifs du module absents");
E("closeModal()");

/* 4. une lecon : correction, memo, pave numerique, fin */
E("S.active='PATRI';save()");
E(`(()=>{const q=EXOS.filter(e=>unitOf(e.u).c==='PATRI');
  L={uid:q[0].u,li:0,cid:'PATRI',mode:'normal',queue:[q.find(e=>e.t==='num'),q.find(e=>e.t==='mcq'),q.find(e=>e.t==='story')],idx:0,wrong:0,ok:0,combo:0,maxCombo:0,repeat:[],errors:[]};
  S.seenNotions=EXOS.map(e=>e.i); show('lesson'); nextQ();})()`); await wait(60);
if(!doc.body.classList.contains("arc-focus"))ko("la leçon ne passe pas en plein écran");
if(doc.querySelectorAll("#arc-pad button").length!==12)ko("pavé numérique absent");
E("arcKey('4');arcKey('2');arcKey('del')");
if(doc.getElementById("numin").value!=="4")ko("pavé numérique : saisie incorrecte");
clic(doc.getElementById("btn-check")); await wait(60);
const bad=doc.querySelector("#checkbar.bad .arcv");
console.log("erreur expliquée :",!!bad,"| réponse barrée :",doc.getElementById("numin").classList.contains("arc-bad"),"| mémo :",!!doc.querySelector("#checkbar .arc-memo"));
if(!bad)ko("correction d'erreur non restylée");
if(!doc.querySelector("#checkbar .arc-memo"))ko("mémo absent de la correction");
if(!/Des Parents Aux Cousins|«/.test((doc.querySelector("#checkbar .arc-memo")||{}).textContent||""))ko("mémo mal extrait");
clic(doc.getElementById("btn-check")); await wait(60);
E("L.combo=3;(()=>{const b=[...document.querySelectorAll('#qwrap .choice')].find(x=>+x.dataset.v===A.ex.a);pick(b,+b.dataset.v)})()");
clic(doc.getElementById("btn-check")); await wait(60);
const combo=doc.querySelector("#checkbar.good .arc-combo");
console.log("bonne réponse :",!!doc.querySelector("#checkbar.good"),"| combo :",combo?combo.textContent.trim():"absent");
if(!combo)ko("combo absent de la bonne réponse");
if(!doc.querySelector("#verdict .verdict img"))ko("la mascotte a disparu de la correction");
E("L.idx=L.queue.length;L.repeat=[];finish()"); await wait(80);
const st=doc.querySelectorAll("#mcard .arc-stats .b").length;
console.log("fin de leçon :",st,"compteurs | mascotte :",!!doc.querySelector("#mcard img.hero"),"| boutons :",doc.querySelectorAll("#mcard button.btn").length);
if(st!==3)ko("fin de leçon : XP, précision et temps attendus");
if(!doc.querySelector("#mcard img.hero"))ko("fin de leçon : mascotte perdue");
E("closeModal();quitLesson()"); await wait(60);
if(doc.body.classList.contains("arc-focus"))ko("la barre de navigation ne revient pas après la leçon");

/* 5. les cinq jeux, sur trois cours */
for(const cid of ["PATRI","TENNIS","MRC"]){
  E(`S.active='${cid}';save()`);
  const xp0=E("S.xp");
  E("arcGame('eclair')"); await wait(40);
  const tuiles=doc.querySelectorAll("#gamebody .arc-tile").length;
  E("(()=>{for(let n=0;n<12;n++){const i=0;const b=document.querySelector('#gamebody .arc-tile:not(.ok)');if(!b)break;const m=/arcTap\\('L',(\\d+)\\)/.exec(b.getAttribute('onclick'));if(!m)break;arcTap('L',+m[1]);arcTap('R',+m[1]);}})()");
  E("(()=>{const g=document.querySelector('#gamebody');})()");
  E("arcGame('vf')"); await wait(40); E("arcVF(true);arcVF(false);arcVF(true)");
  const vf=/C'était|Bien vu/.test(doc.getElementById("gamebody").textContent);
  E("arcGame('frise')"); await wait(40);
  E("(()=>{for(let r=0;r<3;r++){const n=document.querySelectorAll('#gamebody .arc-chip').length;for(let k=0;k<n;k++)arcFrise(k);arcFriseCheck();arcFriseNext();}})()");
  const frise=/Chronologie parfaite|Frises terminées/.test(doc.getElementById("gamebody").textContent);
  E("arcGame('boss')"); await wait(40);
  E("(()=>{for(let n=0;n<20;n++){if(!document.querySelector('#gamebody .arc-opt'))break;arcBoss(0);arcBossNext();}})()");
  const boss=/Boss vaincu|Le Diable a gagné/.test(doc.getElementById("gamebody").textContent);
  E("arcGame('duel')"); await wait(40);
  E("(()=>{for(let n=0;n<7;n++){arcDuel(0);arcDuelNext();}})()");
  const duel=/Duel gagné|Égalité|Duel perdu/.test(doc.getElementById("gamebody").textContent);
  const gain=E("S.xp")-xp0;
  console.log(" ",cid,"éclair",tuiles,"tuiles | vrai-faux",vf,"| frise",frise,"| boss",boss,"| duel",duel,"| XP gagnés",gain);
  if(tuiles!==10)ko(cid+" : éclair, 10 tuiles attendues");
  if(!vf)ko(cid+" : vrai ou faux sans retour"); if(!frise)ko(cid+" : frise non terminée");
  if(!boss)ko(cid+" : boss non terminé"); if(!duel)ko(cid+" : duel non terminé");
  if(gain<=0)ko(cid+" : aucun XP gagné par les jeux");
  E("arcQuit()"); await wait(30);
}
/* un jeu interrompu ne laisse pas de minuteur */
E("arcGame('eclair')"); await wait(30); E("setTab('league')"); await wait(30);
if(!doc.getElementById("sc-league").classList.contains("on"))ko("quitter un jeu par les onglets ne marche pas");

/* 5 bis. categories : renommer, ajouter, deplacer, supprimer une vide */
E("setTab('courses');arcOrg(true)"); await wait(40);
const nCat0=doc.querySelectorAll("#coursesbody .arc-catbox").length;
E("arcCatAdd()"); await wait(20);
const idNew=E("S.cats.add[S.cats.add.length-1].id");
doc.getElementById("arc-catin").value="Mes favoris"; E(`arcCatSave('${idNew}')`); await wait(20);
E(`arcCatTo('MMA','${idNew}')`); await wait(20);
const okMv=E(`catOf('MMA').nm`)==="Mes favoris";
E("arcCatRen('sport')"); doc.getElementById("arc-catin").value="Sport"; E("arcCatSave('sport')");
const okRen=E("CATS.find(k=>k.id==='sport').nm")==="Sport";
E(`arcCatTo('MMA','sport')`); E(`arcCatDel('${idNew}')`); await wait(20);
const okDel=!E(`CATS.some(k=>k.id==='${idNew}')`)&&E("catOf('MMA').id")==="sport";
console.log("catégories :",nCat0,"| ajout+déplacement",okMv,"| renommage",okRen,"| suppression",okDel,"| poignées",doc.querySelectorAll("#coursesbody [data-grip]").length);
if(!okMv||!okRen||!okDel)ko("gestion des catégories cassée");
E("arcCatRen('sport')"); doc.getElementById("arc-catin").value="Sport et santé"; E("arcCatSave('sport')"); E("arcOrg(false)");
/* la lecon du module se ferme par une croix */
E(`openGuide(courseUnits('MMA')[0].id)`); await wait(30);
if(!doc.querySelector("#mcard .arc-mclose"))ko("pas de croix pour fermer la leçon du module");
E("closeModal()");

/* 6. ligue, boutique, défis, réviser, profil */
const ecrans={league:".arc-cups",shop:".shopit .si img",quests:".quest .qi img",review:".arc-games",profile:".arc-goalcard"};
E("setTab('profile')"); await wait(60);
const acc=doc.querySelectorAll("#profilebody > details.arc-acc").length;
console.log("profil rangé :",acc,"sections repliables | réglages en grille :",!!doc.querySelector("#profilebody .arc-setgrid"));
if(acc<6)ko("profil non rangé en sections");
if(doc.querySelectorAll("#profilebody .tabrow").length<5)ko("réglage des onglets perdu dans le profil");
for(const [t,sel] of Object.entries(ecrans)){
  E(`setTab('${t}')`); await wait(60);
  const ok=!!doc.querySelector("#sc-"+t+" "+sel);
  console.log(" ",t,":",ok?"habillé":"PROBLÈME");
  if(!ok)ko("écran "+t+" non habillé ("+sel+")");
}
/* les lecons sont ecrites en phrases : aucun point-virgule dans la prose
   (on tolere les citations entre guillemets et les formules) */
const semi=E(`UNITS.map(u=>{ const t=String(u.guide||"").replace(/<div class="formula">[\\s\\S]*?<\\/div>/g,"").replace(/<svg[\\s\\S]*?<\\/svg>/g,"")
  .replace(/<[^>]+>/g," ").replace(/«[^»]*»/g,""); return / ; |\\s;\\s*$/m.test(t)?u.c+" "+u.id:null; }).filter(Boolean)`);
console.log("leçons avec des points-virgules :",semi.length,semi.slice(0,6).join(", "));
if(semi.length)ko("points-virgules dans la prose des leçons : "+semi.slice(0,6).join(", "));
/* serie juste : un vrai jour manque remet l affichage a 0, un gel sauve un jour et se voit */
E("(()=>{const d=new Date();d.setDate(d.getDate()-4);S.lastDay=fmtDayT(d);S.streak=5;})()".replace("fmtDayT(d)","d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')"));
E("refreshTop()");
const st0=E("S.streak");
E("(()=>{const d=new Date();d.setDate(d.getDate()-2);S.lastDay=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');S.streak=3;S.freezes=1;S.gelDays=[];touchDay(S.active);})()");
const gel=E("S.gelDays.length"), st1=E("S.streak");
E("setTab('path')"); await wait(40);
console.log("série après 4 jours sans leçon :",st0,"| gel utilisé :",gel,"jour noté | série :",st1,"| flocon dans la semaine :",!!doc.querySelector(".arc-week .d.gel"));
if(st0!==0)ko("la série affichée ne retombe pas à 0 après un jour manqué");
if(gel!==1||st1!==4)ko("le gel de série n'est pas noté");
/* coffres animes, trophees, icones de cours */
E("S.active='MMA';(()=>{const u=courseUnits('MMA')[0].id;openChest('chest-'+u+'-2');})()"); await wait(40);
const fx=doc.querySelector(".arc-fx");
console.log("animation de coffre :",!!fx,"| récompense :",fx?fx.querySelector(".card").textContent.replace(/\s+/g," ").trim().slice(0,60):"");
if(!fx)ko("pas d'animation à l'ouverture du coffre");
if(fx)fx.remove();
E("setTab('league')"); await wait(40);
if(doc.querySelectorAll("#leaguebody .arc-trophy").length<6)ko("trophées des divisions absents");
const fallback=E("COURSES.filter(c=>!/arc-cb/.test(badgeSVG(c.id,40))).map(c=>c.id)");
if(fallback.length)ko("icônes de cours non refaites : "+fallback.join(","));
/* le contenu n a pas bouge */
console.log("cours :",E("COURSES.length"),"| unités :",E("UNITS.length"),"| exercices :",E("EXOS.length"));

console.log("\nERREURS:",errs.length,errs.slice(0,8));
process.exit(0);
})();
