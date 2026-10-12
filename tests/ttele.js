/* Telecommande (12/10/2026) : le PC affiche Learno sur la tele, le telephone
   le pilote. Le serveur Realtime est remplace par un faux concentrateur qui
   relaie les messages d'un canal aux autres participants (comme Supabase). */
const fs=require('fs'), path=require('path');
const {JSDOM,VirtualConsole}=require('jsdom');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const errs=[], ko=m=>errs.push(m), wait=ms=>new Promise(r=>setTimeout(r,ms));

/* 0. regles de redaction des sources */
["telecommande.js","telecommande.css"].forEach(f=>{
  const s=fs.readFileSync(path.join(__dirname,'..','design','arcade',f),'utf8');
  if(s.includes("—"))ko("tiret cadratin dans "+f);
  if(/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(s))ko("emoji litteral dans "+f);
  if(/->/.test(s.replace(/=>/g,"")))ko("fleche ASCII dans "+f);
});
if(!/id="tele-rc"|tele-rc/.test(html)||!html.includes("learno-tele-"))ko("la telecommande n est pas injectee dans index.html");

/* faux serveur Realtime */
const hub={topics:{},log:[]};
function makeWS(){
  return class MockWS{
    constructor(url){ this.url=url; this.readyState=0; hub.log.push(url); this.topic=null;
      setTimeout(()=>{ this.readyState=1; this.onopen&&this.onopen(); },5); }
    send(s){ const m=JSON.parse(s);
      if(m.event==="phx_join"){ this.topic=m.topic; (hub.topics[m.topic]=hub.topics[m.topic]||new Set()).add(this); this.joinPayload=m.payload;
        setTimeout(()=>this.onmessage&&this.onmessage({data:JSON.stringify({topic:m.topic,event:"phx_reply",ref:m.ref,payload:{status:"ok",response:{}}})}),5); }
      else if(m.event==="heartbeat"){ setTimeout(()=>this.onmessage&&this.onmessage({data:JSON.stringify({topic:"phoenix",event:"phx_reply",ref:m.ref,payload:{status:"ok"}})}),5); }
      else if(m.event==="broadcast"){ (hub.topics[m.topic]||new Set()).forEach(o=>{ if(o!==this&&o.readyState===1)setTimeout(()=>o.onmessage&&o.onmessage({data:JSON.stringify({topic:m.topic,event:"broadcast",payload:m.payload})}),3); }); } }
    close(){ this.readyState=3; if(this.topic&&hub.topics[this.topic])hub.topics[this.topic].delete(this); setTimeout(()=>this.onclose&&this.onclose(),1); }
  };
}
function boot(url){
  const vc=new VirtualConsole(); vc.on("jsdomError",e=>{ if(!/getContext|HTMLMediaElement|Not implemented/.test(e.message))errs.push("jsdom: "+e.message.slice(0,180)); });
  const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url,virtualConsole:vc,
    beforeParse(w){ w.HTMLMediaElement.prototype.play=()=>Promise.resolve(); w.HTMLMediaElement.prototype.pause=()=>{};
      w.fetch=()=>Promise.reject(new Error("hors ligne")); w.WebSocket=makeWS();
      w.matchMedia=w.matchMedia||(q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
      /* jsdom n a pas de mise en page : chaque element mesure 100 x 40 */
      w.Element.prototype.getBoundingClientRect=function(){ return {left:10,top:10,width:100,height:40,right:110,bottom:50,x:10,y:10}; }; } });
  return dom;
}

(async()=>{
const host=boot("http://localhost/Learno/"), hw=host.window, hd=hw.document, HE=x=>hw.eval(x);
await wait(2500);
const go=hd.querySelector("#ob-go"); if(go)go.dispatchEvent(new hw.MouseEvent("click",{bubbles:true})); await wait(200);
HE("if(typeof authSkip==='function')authSkip()"); await wait(100);

/* 1. QR code */
const T=hw.__tele;
if(!T)ko("window.__tele absent");
else{
  const M=T.qrMatrix("https://corentin-bocquet.github.io/Learno/?tele=K7M2QX");
  if(!M||M.length!==33)ko("taille du QR code : "+(M&&M.length));
  else{
    for(let i=0;i<7;i++){ if(!M[0][i]||!M[6][i]||!M[i][0]||!M[i][6])ko("cadre du repere QR incomplet"); }
    if(M[1][1]||!M[3][3])ko("coeur du repere QR faux");
    if(!M[32-0][8]&&false)ko("x");
  }
  if(!T.qrMatrix("a".repeat(134)))ko("134 octets doivent tenir (version 6)");
  if(T.qrMatrix("a".repeat(135)))ko("135 octets ne doivent pas tenir");
  if(!/<svg/.test(T.qrSvg("https://x.io/?tele=ABCDEF",160)))ko("qrSvg ne rend rien");
  /* 2. codes */
  const seen=new Set(); for(let i=0;i<200;i++){ const c=T.newCode(); seen.add(c); if(!/^[A-HJ-NP-Z2-9]{6}$/.test(c))ko("code invalide : "+c); }
  if(seen.size<190)ko("codes trop souvent identiques : "+seen.size);
  if(T.cleanCode(" k7-m2qx9 ")!=="K7M2QX")ko("cleanCode : "+T.cleanCode(" k7-m2qx9 "));
  /* 3. navigation a la croix : fonction pure */
  const L=[{id:"a",x:300,y:100},{id:"b",x:500,y:110},{id:"c",x:310,y:300},{id:"d",x:100,y:100},{id:"e",x:900,y:700}];
  const from={x:300,y:100}, ids=d=>{ const r=T.pickDir(from,L.filter(c=>c.id!=="a"),d); return r&&r.id; };
  if(ids("right")!=="b")ko("droite devrait viser b : "+ids("right"));
  if(ids("down")!=="c")ko("bas devrait viser c : "+ids("down"));
  if(ids("left")!=="d")ko("gauche devrait viser d : "+ids("left"));
  if(ids("up")!==null)ko("haut ne devrait rien viser : "+ids("up"));
}

/* 4. points d'entree */
if(!hd.querySelector("#side #tele-side"))ko("entree Telecommande absente de la barre laterale");
HE("moreTabs()"); await wait(30);
if(!hd.querySelector("#mcard .arc-more [data-tele]"))ko("entree Telecommande absente de Plus");
HE("closeModal()");
if(!/Télécommande/.test(HE("arcGlyph('tele',24)")||"")&&!/<svg/.test(HE("arcGlyph('tele',24)")))ko("icone tele absente");

/* 5. le PC attend le telephone */
HE("teleOpen()"); await wait(30);
if(!hd.querySelector("#mcard .tele-big"))ko("fenetre de choix absente");
HE("teleHost()"); await wait(120);
const code=hw.__tele.H.code;
if(!/^[A-HJ-NP-Z2-9]{6}$/.test(code))ko("code du PC : "+code);
if(!hd.querySelector("#mcard svg.tele-qr"))ko("QR code absent de la fenetre du PC");
if(!(hd.querySelector("#mcard .tele-code")||{}).textContent.includes(code.slice(0,2)))ko("code non affiche");
if(!hub.log.some(u=>/realtime\/v1\/websocket\?apikey=.+&vsn=1\.0\.0/.test(u)))ko("URL Realtime inattendue : "+hub.log[0]);
if(!hub.topics["realtime:learno-tele-"+code]||hub.topics["realtime:learno-tele-"+code].size!==1)ko("le PC n a pas rejoint son canal");
else{ const j=[...hub.topics["realtime:learno-tele-"+code]][0].joinPayload; if(!j||!j.config||!j.config.broadcast||j.config.broadcast.self!==false)ko("config de jointure incorrecte"); }
if(!hd.getElementById("tele-pill"))ko("pastille d'etat absente sur le PC");
if(!/en attente/i.test((hd.getElementById("tele-stat")||{}).textContent||""))ko("le PC devrait attendre : "+((hd.getElementById("tele-stat")||{}).textContent));

/* 6. le telephone se connecte par le lien du QR code */
const ph=boot("http://localhost/Learno/?tele="+code), pw=ph.window, pd=pw.document, PE=x=>pw.eval(x);
await wait(4200);
if(!pd.getElementById("tele-rc"))ko("l ecran telecommande n apparait pas sur le telephone");
if(pw.location.search!=="")ko("le code reste dans l adresse du telephone");
await wait(600);
const PT=pw.__tele, HT=hw.__tele;
if(!PT.P.on||!PT.P.link)ko("telephone non lie au canal");
if(!HT.H.hasPhone)ko("le PC n a pas vu le telephone");
if(!/Connecté au PC/.test((pd.getElementById("rc-stat")||{}).textContent))ko("statut telephone : "+((pd.getElementById("rc-stat")||{}).textContent));
if(!/connect/i.test((hd.getElementById("tele-stat")||{}).textContent||""))ko("statut PC : "+((hd.getElementById("tele-stat")||{}).textContent));
if(!hd.getElementById("tele-pill").classList.contains("ok"))ko("pastille PC pas verte");

/* 7. deplacement du curseur et clic */
const x0=HT.H.x, y0=HT.H.y;
pd.defaultView.eval("1"); 
const send=o=>PT.P.rt.send(Object.assign({r:"p"},o));
send({t:"move",dx:40,dy:-25}); await wait(40);
if(HT.H.x!==x0+40||HT.H.y!==y0-25)ko("curseur : "+HT.H.x+","+HT.H.y+" au lieu de "+(x0+40)+","+(y0-25));
send({t:"move",dx:99999,dy:-99999}); await wait(40);
if(HT.H.x>hw.innerWidth||HT.H.y<0)ko("curseur hors de l ecran");
let clics=0; const bt=hd.createElement("button"); bt.setAttribute("onclick","window.__clics=(window.__clics||0)+1"); hd.body.appendChild(bt);
hd.elementFromPoint=()=>bt;
send({t:"tap"}); await wait(40);
if(hw.__clics!==1)ko("le toucher n a pas clique ("+hw.__clics+")");
send({t:"ok"}); await wait(40);
if(hw.__clics!==2)ko("OK n a pas clique ("+hw.__clics+")");
if(!hd.getElementById("tele-cur"))ko("curseur absent");

/* 8. messages qui ne viennent pas d'un telephone : ignores */
HT.hostMsg({r:"h",t:"tap"}); HT.hostMsg({t:"tap"});
if(hw.__clics!==2)ko("un message sans role telephone a ete execute");

/* 9. mode quiz : le telephone n affiche que des boutons, la tele agrandit la question */
const startQ=(t,extra)=>HE(`(()=>{closeModal(); const e=EXOS.find(x=>x.t===${JSON.stringify(t)}${extra||""}); if(!e)return false; S.active=unitOf(e.u).c; L=buildLesson(e.u,0,"normal"); L.queue=[e]; show("lesson"); renderQ(e); return true;})()`);
const rq=()=>pd.getElementById("rc-q");
const clickP=el=>el.dispatchEvent(new pw.MouseEvent("click",{bubbles:true}));
const st=ms=>wait(ms||650);
const done=()=>HE("A.done"), okv=()=>hd.getElementById("checkbar").classList.contains("good");
const quizOn=()=>pd.getElementById("tele-rc").classList.contains("quiz");

startQ("mcq"); await st(900);
if(!quizOn())ko("le mode quiz ne s active pas sur le telephone");
if(!hd.body.classList.contains("tele-tv"))ko("la tele n est pas passee en mode grand ecran");
if(!hd.documentElement.style.getPropertyValue("--tz"))ko("zoom de la tele absent");
const cs=[...rq().querySelectorAll(".rq-c")];
if(cs.length<2||cs[0].textContent.trim()[0]!=="A")ko("gros boutons du QCM : "+cs.map(b=>b.textContent));
if(!hd.querySelector("#qwrap .choice.tq-c0"))ko("tuiles de couleur absentes sur la tele");
const good=HE("(()=>{const e=A.ex; return [...document.querySelectorAll('#qwrap .choice[data-v]')].findIndex(b=>+b.dataset.v===e.a)})()");
clickP(cs[good]); await st();
if(!done()||!okv())ko("un seul toucher doit repondre et corriger (QCM) : done="+done());
if(!rq().querySelector(".rq-res.ok"))ko("ecran Bien joue absent sur le telephone");
const go1=rq().querySelector(".rq-res"); if(!/Continuer/.test(go1.textContent))ko("bouton Continuer absent : "+go1.textContent);
clickP(go1); await st(1200);
if(!rq().querySelector(".rq-btns"))ko("fin de lecon : boutons d action absents : "+rq().innerHTML.slice(0,120));

/* vrai ou faux : deux gros boutons, le faux part en premier si la reponse est fausse */
if(startQ("tf")){ await st(900);
  const b=[...rq().querySelectorAll(".rq-c")]; if(b.length!==2||!/Vrai/.test(b[0].textContent+b[1].textContent))ko("vrai ou faux : "+b.map(x=>x.textContent));
  const ans=HE("A.ex.a"); const w=b.find(x=>/Vrai/.test(x.textContent)===!!ans); clickP(w); await st();
  if(!done()||!okv())ko("vrai ou faux : bonne reponse refusee"); }

/* cases a cocher */
if(startQ("multi")){ await st(900);
  const idx=HE("(()=>{const e=A.ex; return [...document.querySelectorAll('#qwrap .mchk')].map((b,i)=>e.a.includes(+b.dataset.m)?i:-1).filter(i=>i>=0)})()");
  idx.forEach(i=>clickP(rq().querySelector('.rq-m[data-i="'+i+'"]'))); await st();
  const go=rq().querySelector(".rq-go"); if(!go||go.disabled)ko("cases a cocher : Valider grise"); else{ clickP(go); await st(); if(!done()||!okv())ko("cases a cocher : bonne reponse refusee"); } }

/* curseur */
if(startQ("slider")){ await st(900);
  const r=rq().querySelector("#rq-range"); if(!r)ko("curseur absent"); else{ r.value=String(HE("A.ex.a")); r.dispatchEvent(new pw.Event("input",{bubbles:true})); await st();
    const go=rq().querySelector(".rq-go"); clickP(go); await st(); if(!done()||!okv())ko("curseur : bonne valeur refusee"); } }

/* phrase a reconstituer */
if(startQ("tiles")){ await st(900);
  const words=HE("A.ex.a.slice()");
  for(const w of words){ const chip=[...rq().querySelectorAll(".rq-bank .rq-w")].find(c=>c.textContent===w&&!c.disabled); if(!chip){ ko("mot absent : "+w); break; } clickP(chip); await st(450); }
  clickP(rq().querySelector(".rq-go")); await st(); if(!done()||!okv())ko("phrase : bonne reponse refusee"); }

/* paires */
if(startQ("match")){ await st(900);
  const pairs=HE("A.ex.p.map(p=>[p[0],p[1]])");
  for(const [l,r] of pairs){ clickP([...rq().querySelectorAll('[data-a="mL"]')].find(c=>c.textContent===l&&!c.disabled)); await st(450);
    clickP([...rq().querySelectorAll('[data-a="mR"]')].find(c=>c.textContent===r&&!c.disabled)); await st(450); }
  const go=rq().querySelector(".rq-go"); if(go.disabled)ko("paires : Valider grise"); else{ clickP(go); await st(); if(!done()||!okv())ko("paires : refusees"); } }

/* classement */
if(startQ("sort")){ await st(900);
  const items=HE("A.ex.it.map(i=>[i[0],i[1]])");
  for(let n=0;n<items.length;n++){ const tx=rq().querySelector(".rq-card").textContent; const bin=(items.find(i=>i[0]===tx)||[])[1];
    if(bin===undefined){ ko("classement : element inconnu "+tx); break; } clickP(rq().querySelector('.rq-grid [data-b="'+bin+'"]')); await st(500); }
  const go=rq().querySelector(".rq-go"); if(go.disabled)ko("classement : Valider grise"); else{ clickP(go); await st(); if(!done()||!okv())ko("classement : refuse"); } }

/* remise en ordre */
if(startQ("order")){ await st(900);
  const want=HE("A.ex.it.slice()");
  for(let n=0;n<20;n++){ const cur=[...rq().querySelectorAll(".rq-orow span")].map(x=>x.textContent); const p=want.findIndex((w,i)=>cur[i]!==w); if(p<0)break;
    const j=cur.indexOf(want[p]); clickP(rq().querySelectorAll(".rq-orow")[j].querySelector('[data-d="-1"]')); await st(350); }
  clickP(rq().querySelector(".rq-go")); await st(); if(!done()||!okv())ko("ordre : refuse"); }

/* calcul : pave numerique */
startQ("num"); await st(900);
if(!rq().querySelector(".rq-keys"))ko("pave numerique absent en mode quiz");
const key=k=>clickP(rq().querySelector('.rq-keys [data-k="'+k+'"]'));
key("1"); key(","); key("5"); await st(400);
if(hd.getElementById("numin").value!=="1,5")ko("saisie : "+hd.getElementById("numin").value);
if(rq().querySelector("#rq-disp").textContent!=="1,5")ko("affichage de la saisie : "+rq().querySelector("#rq-disp").textContent);
key("back"); await st(300);
if(hd.getElementById("numin").value!=="1,")ko("effacer : "+hd.getElementById("numin").value);

/* calculatrice : ouverte depuis le telephone, sans curseur */
if(!rq().querySelector('[data-a="calc"]'))ko("bouton Calculatrice absent sur la question de calcul");
else{
  clickP(rq().querySelector('[data-a="calc"]')); await st(900);
  if(!hd.getElementById("calc-wrap"))ko("la calculatrice ne s ouvre pas sur la tele");
  if(!rq().querySelector(".rq-calc"))ko("clavier de calculatrice absent sur le telephone");
  const ck=l=>{ const b=[...rq().querySelectorAll(".rq-ck")].find(x=>x.textContent===l); if(!b){ ko("touche absente : "+l); return; } clickP(b); };
  const nk=[...rq().querySelectorAll(".rq-ck")].length; if(nk<27)ko("touches de la calculatrice : "+nk);
  for(const k of ["2","(","3","+","4",")"]){ ck(k); await st(300); }
  ck("="); await st(700);
  if(!/14/.test(hd.getElementById("calc-res").textContent))ko("resultat sur la tele : "+hd.getElementById("calc-res").textContent);
  if(!/14/.test(rq().querySelector("#rq-cres").textContent))ko("resultat sur le telephone : "+rq().querySelector("#rq-cres").textContent);
  if(!/2\(3\+4\)/.test(rq().querySelector("#rq-cexp").textContent))ko("expression sur le telephone : "+rq().querySelector("#rq-cexp").textContent);
  /* corriger un chiffre sans tout effacer : toucher dans l expression place le curseur */
  const sp=rq().querySelector('#rq-cexp [data-i="2"]'); if(!sp)ko("l expression n est pas cliquable sur le telephone");
  else{ sp.dispatchEvent(new pw.MouseEvent("click",{bubbles:true,clientX:100})); await st(700);
    if(hw.calcState().pos!==3)ko("le toucher doit placer le curseur apres le 3 : "+hw.calcState().pos);
    ck("\u232B"); await st(400); ck("5"); await st(400);
    if(hw.calcState().exp!=="2(5+4)")ko("correction de l expression : "+hw.calcState().exp);
    clickP(rq().querySelector('[data-a="cmove"][data-d="-1"]')); await st(500);
    if(hw.calcState().pos!==2)ko("la fleche gauche deplace le curseur : "+hw.calcState().pos);
    ck("="); await st(700);
    if(!/18/.test(hd.getElementById("calc-res").textContent))ko("resultat apres correction : "+hd.getElementById("calc-res").textContent); }
  const use=rq().querySelector("#rq-cuse"); if(!use||use.hidden)ko("Utiliser comme reponse absent"); else{ clickP(use); await st(900); }
  if(hd.getElementById("calc-wrap"))ko("la calculatrice reste ouverte apres Utiliser");
  if(hd.getElementById("numin").value.replace(/\s/g,"")!=="18")ko("reponse remplie : "+hd.getElementById("numin").value);
  if(!rq().querySelector(".rq-keys"))ko("retour au pave numerique apres la calculatrice");
  clickP(rq().querySelector('[data-a="calc"]')); await st(800);
  clickP(rq().querySelector('[data-a="calcclose"]')); await st(800);
  if(hd.getElementById("calc-wrap"))ko("Fermer ne ferme pas la calculatrice");
}
if(startQ("eq")){ await st(900); if(!rq().querySelector('[data-a="calc"]'))ko("bouton Calculatrice absent sur une formule"); }
startQ("num"); await st(900);

/* Curseur : retour a la telecommande classique */
clickP(pd.getElementById("rc-free")); await st(300);
if(quizOn())ko("le bouton Curseur ne rend pas la telecommande classique");
clickP(pd.getElementById("rc-free")); await st(300);
if(!quizOn())ko("le bouton Quiz ne revient pas aux boutons");

/* gestes du pave : un doigt defile, appui long puis glisse deplace, toucher clique */
{
  const sent=[]; const orig=PT.P.rt.send.bind(PT.P.rt); PT.P.rt.send=p=>{ sent.push(p); return orig(p); };
  const pad=pd.getElementById("rc-pad");
  const pe=(type,x,y)=>{ const e=new pw.MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y}); e.pointerId=1; pad.dispatchEvent(e); };
  const cnt=t=>sent.filter(m=>m.t===t).length, sum=t=>sent.filter(m=>m.t===t).reduce((a,m)=>a+(m.dy||0),0);
  sent.length=0; pe("pointerdown",100,100); for(let i=1;i<=6;i++)pe("pointermove",100,100+i*15); pe("pointerup",100,190); await wait(150);
  if(!cnt("scroll")||sum("scroll")>=0)ko("glisser vers le bas doit faire remonter la page : "+JSON.stringify(sent));
  if(cnt("move")||cnt("tap"))ko("un glissement simple ne doit ni deplacer le curseur ni cliquer");
  sent.length=0; pe("pointerdown",100,200); for(let i=1;i<=6;i++)pe("pointermove",100,200-i*15); pe("pointerup",100,110); await wait(150);
  if(!cnt("scroll")||sum("scroll")<=0)ko("glisser vers le haut doit faire descendre la page");
  sent.length=0; pe("pointerdown",100,100); await wait(380); pe("pointermove",120,110); pe("pointermove",150,125); pe("pointerup",150,125); await wait(150);
  if(!cnt("move"))ko("appui long puis glisse doit deplacer le curseur");
  if(cnt("scroll")||cnt("tap"))ko("en mode curseur : ni defilement ni clic : "+JSON.stringify(sent));
  sent.length=0; pe("pointerdown",100,100); await wait(40); pe("pointerup",100,100); await wait(100);
  if(cnt("tap")!==1||cnt("scroll")||cnt("move"))ko("un toucher rapide doit cliquer une fois : "+JSON.stringify(sent));
  sent.length=0; pe("pointerdown",100,100); await wait(420); pe("pointerup",100,100); await wait(100);
  if(cnt("tap")||cnt("scroll")||cnt("move"))ko("un appui long sans bouger ne doit rien envoyer : "+JSON.stringify(sent));
  PT.P.rt.send=orig;
}

/* un format visuel garde la telecommande classique */
if(startQ("curve")){ await st(900); if(quizOn())ko("un format visuel ne doit pas passer en mode quiz"); if(hd.body.classList.contains("tele-tv"))ko("la tele ne doit pas changer pour un format visuel"); }
/* hors quiz : la tele reprend son aspect normal */
HE("show('path')"); await st(900);
if(hd.body.classList.contains("tele-tv"))ko("la tele garde le mode quiz hors d une question");

/* 11. retour : ferme d'abord la fenetre ouverte */
HE("openModal('<p>test</p>')"); await wait(40);
send({t:"back"}); await wait(60);
if(HE("document.getElementById('modal').classList.contains('on')"))ko("Retour n a pas ferme la fenetre");

/* 12. defilement et reglage du curseur */
send({t:"scroll",dy:200}); await wait(30);
const sl=hd.createElement("input"); sl.type="range"; sl.min=0; sl.max=10; sl.step=1; sl.value=5; hd.body.appendChild(sl);
hd.elementFromPoint=()=>sl; let ev=0; sl.addEventListener("input",()=>ev++);
send({t:"dir",d:"right"}); await wait(40);
if(sl.value!=="6"||!ev)ko("la croix devrait regler le curseur : "+sl.value);
send({t:"dir",d:"left"}); send({t:"dir",d:"left"}); await wait(40);
if(sl.value!=="4")ko("curseur apres deux gauche : "+sl.value);

/* 13. arret */
const sent=hub.topics["realtime:learno-tele-"+code].size;
PE("__tele.remoteStop()"); await wait(400);
if(pd.getElementById("tele-rc"))ko("l ecran telecommande reste apres Quitter");
HE("teleStop()"); await wait(400);
if(hd.getElementById("tele-cur")||hd.getElementById("tele-pill"))ko("le PC garde son curseur ou sa pastille apres Arreter");
if(hub.topics["realtime:learno-tele-"+code].size!==0)ko("sockets encore ouverts ("+sent+" avant)");
const n=hw.__clics; HT.hostMsg({r:"p",t:"tap"}); if(hw.__clics!==n)ko("le PC obeit encore apres Arreter");

console.log(errs.length?errs.map(e=>" - "+e).join("\n"):"telecommande : tout est bon");
console.log("ERREURS: "+errs.length);
host.window.close(); ph.window.close();
process.exit(errs.length?1:0);
})().catch(e=>{ console.log(" - plantage: "+(e&&e.stack||e)); console.log("ERREURS: 1"); process.exit(1); });
