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

/* 9. un QCM se joue avec les boutons A B C D */
HE(`(()=>{const e=EXOS.find(x=>x.t==="mcq"); S.active=unitOf(e.u).c; L=buildLesson(e.u,0,"normal"); L.queue=[e]; show("lesson"); renderQ(e);})()`);
await wait(900);
const labels=[...pd.querySelectorAll("#rc-ch .rc-c")].map(b=>b.textContent);
if(labels.length<2||labels[0]!=="A")ko("boutons de choix sur le telephone : "+JSON.stringify(labels));
const mainBtn=pd.getElementById("rc-main");
if(!mainBtn.disabled)ko("Verifier devrait etre grise avant de choisir");
if(!/V.rifier/.test(mainBtn.textContent))ko("libelle du bouton principal : "+mainBtn.textContent);
pd.querySelector('#rc-ch .rc-c[data-i="1"]').dispatchEvent(new pw.MouseEvent("click",{bubbles:true})); await wait(900);
if(HE("A.val")===null)ko("le choix B n a pas ete pris en compte sur le PC");
if(mainBtn.disabled)ko("Verifier devrait etre actif apres un choix");
mainBtn.dispatchEvent(new pw.MouseEvent("click",{bubbles:true})); await wait(900);
if(!HE("A.done"))ko("la reponse n a pas ete validee");
if(!/Continuer/.test(mainBtn.textContent))ko("le bouton devrait afficher Continuer : "+mainBtn.textContent);
if(pd.querySelectorAll("#rc-ch .rc-c").length)ko("les boutons de choix devraient disparaitre apres la correction");

/* 10. un calcul se saisit au pave numerique */
HE(`(()=>{const e=EXOS.find(x=>x.t==="num"); S.active=unitOf(e.u).c; L=buildLesson(e.u,0,"normal"); L.queue=[e]; show("lesson"); renderQ(e);})()`);
await wait(900);
if(!pd.getElementById("tele-rc").classList.contains("keys"))ko("le pave numerique devrait s ouvrir pour un calcul");
const key=k=>pd.querySelector('.rc-keys [data-k="'+k+'"]').dispatchEvent(new pw.MouseEvent("click",{bubbles:true}));
key("1"); key(","); key("5"); await wait(60);
if(hd.getElementById("numin").value!=="1,5")ko("saisie : "+hd.getElementById("numin").value);
if(HE("document.getElementById('btn-check').disabled"))ko("Verifier devrait etre actif apres la saisie");
key("back"); await wait(40);
if(hd.getElementById("numin").value!=="1,")ko("effacer : "+hd.getElementById("numin").value);

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
