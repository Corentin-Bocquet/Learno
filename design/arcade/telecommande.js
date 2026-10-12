/* =====================================================================
   TELECOMMANDE (demande du 12/10/2026)
   Le PC est branche en HDMI sur la tele et affiche Learno. Le telephone
   devient la telecommande : pave tactile, croix directionnelle, boutons
   A B C D pour les QCM, pave numerique, defilement, retour.
   Transport : Supabase Realtime (broadcast), sans table ni compte. Un code
   de 6 caracteres tire au hasard sur le PC (et un QR code qui l'ouvre sur
   le telephone) designe le canal. Rien n'est ecrit en base.
   Tout passe par des fonctions neuves : aucun cours, aucune regle de jeu
   et aucun ecran existant n'est modifie.
   ===================================================================== */
(function(){
  "use strict";
  if(window.__tele)return;
  const $id=i=>document.getElementById(i);
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const NOTE=ms=>{ try{ if(typeof toast==="function")toast(ms); }catch(e){} };
  const glyph=(k,s)=>(window.arcGlyph?window.arcGlyph(k,s):"");
  const tile=(k,s,c)=>(window.arcTile?window.arcTile(k,s,c):"");
  const ALPHA="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";   /* sans I, O, 0, 1 : illisibles de loin */

  /* ---------------- 1. QR CODE (octets, correction L, versions 1 a 6) ---------------- */
  const QR_TOT=[0,26,44,70,100,134,172], QR_ECC=[0,7,10,15,20,26,18], QR_NB=[0,1,1,1,1,1,2];
  const QR_AL=[[],[],[6,18],[6,22],[6,26],[6,30],[6,34]];
  function gfMul(x,y){ let z=0; for(let i=7;i>=0;i--){ z=(z<<1)^((z>>>7)*0x11D); z^=((y>>>i)&1)*x; } return z&255; }
  function rsDiv(n){ const r=new Array(n).fill(0); r[n-1]=1; let root=1;
    for(let i=0;i<n;i++){ for(let j=0;j<n;j++){ r[j]=gfMul(r[j],root); if(j+1<n)r[j]^=r[j+1]; } root=gfMul(root,2); } return r; }
  function rsRem(data,div){ const r=new Array(div.length).fill(0);
    data.forEach(b=>{ const f=b^r.shift(); r.push(0); div.forEach((c,i)=>{ r[i]^=gfMul(c,f); }); }); return r; }
  function qrMatrix(text){
    const bytes=Array.from(new TextEncoder().encode(String(text)));
    let v=1; while(v<=6&&bytes.length>QR_TOT[v]-QR_ECC[v]*QR_NB[v]-2)v++;
    if(v>6)return null;
    const nData=QR_TOT[v]-QR_ECC[v]*QR_NB[v], bits=[];
    const put=(val,n)=>{ for(let i=n-1;i>=0;i--)bits.push((val>>>i)&1); };
    put(4,4); put(bytes.length,8); bytes.forEach(b=>put(b,8));
    put(0,Math.min(4,nData*8-bits.length)); while(bits.length%8)bits.push(0);
    for(let pad=0xEC;bits.length<nData*8;pad^=0xEC^0x11)put(pad,8);
    const data=[]; for(let i=0;i<bits.length;i+=8)data.push(parseInt(bits.slice(i,i+8).join(""),2));
    const per=nData/QR_NB[v], div=rsDiv(QR_ECC[v]), blocks=[], ecc=[];
    for(let b=0;b<QR_NB[v];b++){ const d=data.slice(b*per,(b+1)*per); blocks.push(d); ecc.push(rsRem(d,div)); }
    const cw=[]; for(let i=0;i<per;i++)blocks.forEach(b=>cw.push(b[i]));
    for(let i=0;i<QR_ECC[v];i++)ecc.forEach(e=>cw.push(e[i]));
    const size=17+4*v, M=[], F=[];
    for(let y=0;y<size;y++){ M.push(new Array(size).fill(false)); F.push(new Array(size).fill(false)); }
    const setF=(x,y,d)=>{ if(x>=0&&y>=0&&x<size&&y<size){ M[y][x]=d; F[y][x]=true; } };
    for(let i=0;i<size;i++){ setF(6,i,i%2===0); setF(i,6,i%2===0); }
    [[3,3],[size-4,3],[3,size-4]].forEach(([cx,cy])=>{ for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){ const d=Math.max(Math.abs(dx),Math.abs(dy)); setF(cx+dx,cy+dy,d!==2&&d!==4); } });
    const al=QR_AL[v];
    al.forEach((cy,i)=>al.forEach((cx,j)=>{ if((i===0&&j===0)||(i===0&&j===al.length-1)||(i===al.length-1&&j===0))return;
      for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)setF(cx+dx,cy+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1); }));
    const fmt=mask=>{ const d=(1<<3)|mask; let r=d; for(let i=0;i<10;i++)r=(r<<1)^((r>>>9)*0x537);
      const b=((d<<10)|r)^0x5412, g=i=>((b>>>i)&1)!==0;
      for(let i=0;i<=5;i++)setF(8,i,g(i)); setF(8,7,g(6)); setF(8,8,g(7)); setF(7,8,g(8)); for(let i=9;i<15;i++)setF(14-i,8,g(i));
      for(let i=0;i<8;i++)setF(size-1-i,8,g(i)); for(let i=8;i<15;i++)setF(8,size-15+i,g(i)); setF(8,size-8,true); };
    fmt(0);
    let k=0;
    for(let right=size-1;right>=1;right-=2){ if(right===6)right=5;
      for(let vert=0;vert<size;vert++)for(let j=0;j<2;j++){ const x=right-j, up=((right+1)&2)===0, y=up?size-1-vert:vert;
        if(!F[y][x]&&k<cw.length*8){ M[y][x]=((cw[k>>>3]>>>(7-(k&7)))&1)!==0; k++; } } }
    const msk=[(x,y)=>(x+y)%2===0,(x,y)=>y%2===0,(x,y)=>x%3===0,(x,y)=>(x+y)%3===0,(x,y)=>(Math.floor(x/3)+Math.floor(y/2))%2===0,
      (x,y)=>x*y%2+x*y%3===0,(x,y)=>(x*y%2+x*y%3)%2===0,(x,y)=>((x+y)%2+x*y%3)%2===0];
    const flip=m=>{ for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(!F[y][x]&&msk[m](x,y))M[y][x]=!M[y][x]; };
    const penalty=()=>{ let p=0;
      for(let t=0;t<2;t++){ for(let a=0;a<size;a++){ let run=1; for(let b=1;b<size;b++){ const c=t?M[b][a]:M[a][b], q=t?M[b-1][a]:M[a][b-1];
        if(c===q){ run++; if(run===5)p+=3; else if(run>5)p++; } else run=1; } } }
      for(let y=0;y<size-1;y++)for(let x=0;x<size-1;x++){ const c=M[y][x]; if(c===M[y][x+1]&&c===M[y+1][x]&&c===M[y+1][x+1])p+=3; }
      const pat=[true,false,true,true,true,false,true,false,false,false,false], pr=pat.slice().reverse();
      const eq=(g,a)=>a.every((c,i)=>g(i)===c);
      for(let y=0;y<size;y++)for(let x=0;x+11<=size;x++){ if(eq(i=>M[y][x+i],pat)||eq(i=>M[y][x+i],pr))p+=40; }
      for(let x=0;x<size;x++)for(let y=0;y+11<=size;y++){ if(eq(i=>M[y+i][x],pat)||eq(i=>M[y+i][x],pr))p+=40; }
      let dark=0; M.forEach(r=>r.forEach(c=>{ if(c)dark++; }));
      p+=Math.floor(Math.abs(dark*20-size*size*10)/(size*size))*10; return p; };
    let best=0, bp=1e9;
    for(let m=0;m<8;m++){ flip(m); fmt(m); const p=penalty(); if(p<bp){ bp=p; best=m; } flip(m); }
    flip(best); fmt(best);
    return M;
  }
  function qrSvg(text,px){
    const M=qrMatrix(text); if(!M)return "";
    const n=M.length, q=4; let d="";
    M.forEach((r,y)=>r.forEach((c,x)=>{ if(c)d+="M"+(x+q)+" "+(y+q)+"h1v1h-1z"; }));
    return `<svg class="tele-qr" viewBox="0 0 ${n+2*q} ${n+2*q}" width="${px}" height="${px}" shape-rendering="crispEdges" role="img" aria-label="QR code de la telecommande"><rect width="${n+2*q}" height="${n+2*q}" fill="#fff"/><path d="${d}" fill="#141432"/></svg>`;
  }

  /* ---------------- 2. CANAL TEMPS REEL (Supabase Realtime, protocole Phoenix) ---------------- */
  function rtOpen(code,onMsg,onLink){
    const R={ws:null,ok:false,stop:false,ref:0,hb:null,retry:0,tm:null,topic:"realtime:learno-tele-"+code};
    const url=()=>SB_URL.replace(/^http/,"ws")+"/realtime/v1/websocket?apikey="+SB_KEY+"&vsn=1.0.0";
    R.send=p=>{ if(!R.ok||!R.ws||R.ws.readyState!==1)return false;
      try{ R.ws.send(JSON.stringify({topic:R.topic,event:"broadcast",payload:{type:"broadcast",event:"cmd",payload:p},ref:String(++R.ref)})); return true; }catch(e){ return false; } };
    const later=()=>{ if(R.stop)return; clearTimeout(R.tm); R.tm=setTimeout(conn,Math.min(8000,700*Math.pow(1.6,R.retry++))); };
    function conn(){
      if(R.stop)return;
      let ws; try{ ws=new WebSocket(url()); }catch(e){ later(); return; }
      R.ws=ws;
      ws.onopen=()=>{
        const j=String(++R.ref);
        ws.send(JSON.stringify({topic:R.topic,event:"phx_join",payload:{config:{broadcast:{self:false,ack:false},presence:{key:""},postgres_changes:[],private:false},access_token:SB_KEY},ref:"j"+j,join_ref:"j"+j}));
        clearInterval(R.hb);
        R.hb=setInterval(()=>{ try{ if(ws.readyState===1)ws.send(JSON.stringify({topic:"phoenix",event:"heartbeat",payload:{},ref:String(++R.ref)})); }catch(e){} },25000);
      };
      ws.onmessage=e=>{
        let m; try{ m=JSON.parse(e.data); }catch(_){ return; }
        if(!m)return;
        if(m.event==="phx_reply"&&m.topic===R.topic&&String(m.ref).charAt(0)==="j"){
          if(m.payload&&m.payload.status==="ok"){ R.ok=true; R.retry=0; onLink(true); } else { R.ok=false; onLink(false); }
        } else if(m.event==="broadcast"&&m.topic===R.topic){
          const p=m.payload; if(p&&p.event==="cmd"&&p.payload)onMsg(p.payload);
        } else if((m.event==="phx_error"||m.event==="phx_close")&&m.topic===R.topic){ try{ ws.close(); }catch(e){} }
      };
      ws.onclose=()=>{ clearInterval(R.hb); const was=R.ok; R.ok=false; if(was||!R.stop)onLink(false); later(); };
      ws.onerror=()=>{};
    }
    R.close=()=>{ R.stop=true; R.ok=false; clearInterval(R.hb); clearTimeout(R.tm); try{ R.ws&&R.ws.close(); }catch(e){} };
    R.wake=()=>{ if(!R.stop&&(!R.ws||R.ws.readyState>1)){ R.retry=0; conn(); } };
    conn();
    return R;
  }
  const newCode=()=>{ const a=new Uint8Array(6);
    if(window.crypto&&crypto.getRandomValues)crypto.getRandomValues(a); else for(let i=0;i<6;i++)a[i]=Math.floor(Math.random()*256);
    return Array.from(a,x=>ALPHA[x%ALPHA.length]).join(""); };
  const cleanCode=s=>String(s||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);
  async function keepAwake(st){ try{ if(st.wl||!navigator.wakeLock)return; st.wl=await navigator.wakeLock.request("screen"); st.wl.addEventListener&&st.wl.addEventListener("release",()=>{ st.wl=null; }); }catch(e){} }
  function freeAwake(st){ try{ st.wl&&st.wl.release&&st.wl.release(); }catch(e){} st.wl=null; }

  /* ---------------- 3. COTE PC : curseur, clic, navigation ---------------- */
  const CLICK='button,a[href],input,select,textarea,summary,label,[onclick],[role="button"],[role="switch"],[role="tab"],[tabindex]:not([tabindex="-1"]),.choice,.tile,.swcard';
  const hooks={};
  const H={on:false,code:"",rt:null,x:0,y:0,seen:0,last:"",timer:null,idle:null,wl:null,link:false,hasPhone:false};
  const vw=()=>window.innerWidth||document.documentElement.clientWidth||1280, vh=()=>window.innerHeight||document.documentElement.clientHeight||720;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const visible=el=>{
    if(!el||el.closest&&el.closest("#tele-cur,#tele-hl,#tele-rc,#tele-pill"))return false;
    if(el.disabled||el.getAttribute&&el.getAttribute("aria-disabled")==="true")return false;
    const r=el.getBoundingClientRect(); if(r.width<6||r.height<6)return false;
    const cs=window.getComputedStyle(el); if(cs.visibility==="hidden"||cs.display==="none"||cs.pointerEvents==="none")return false;
    if(r.right<0||r.bottom<0||r.left>vw()||r.top>vh())return false;
    const cx=clamp(r.left+r.width/2,1,vw()-1), cy=clamp(r.top+r.height/2,1,vh()-1);
    if(document.elementFromPoint){ const hit=document.elementFromPoint(cx,cy); if(!hit)return false; if(!(el===hit||el.contains(hit)||hit.contains(el)))return false; }
    return true; };
  const centerOf=el=>{ const r=el.getBoundingClientRect(); return {x:clamp(r.left+r.width/2,2,vw()-2),y:clamp(r.top+r.height/2,2,vh()-2)}; };
  function clickables(){ return Array.from(document.querySelectorAll(CLICK)).filter(visible); }
  /* choisit la cible dans une direction : fonction pure, testee a part */
  function pickDir(from,list,d){
    let best=null, bs=1e12;
    list.forEach(c=>{
      const dx=c.x-from.x, dy=c.y-from.y;
      const main=d==="right"?dx:d==="left"?-dx:d==="down"?dy:-dy;
      const side=(d==="right"||d==="left")?Math.abs(dy):Math.abs(dx);
      if(main<6||side>main*3.2+30)return;
      const s=main+side*2.4; if(s<bs){ bs=s; best=c; } });
    return best; }
  function under(x,y){ if(!document.elementFromPoint)return null; const e=document.elementFromPoint(x,y); if(!e||(e.closest&&e.closest("#tele-cur,#tele-hl")))return null;
    return e.closest?e.closest(CLICK):null; }
  function scroller(from){
    for(let e=from;e&&e!==document.body;e=e.parentElement){
      const cs=window.getComputedStyle(e); if(/(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+4)return e; }
    const act=document.querySelector(".screen.on .scroll,.screen.on #qwrap"); if(act&&act.scrollHeight>act.clientHeight+4)return act;
    return document.scrollingElement||document.documentElement; }
  function ensureOverlay(){
    if($id("tele-cur"))return;
    const c=document.createElement("div"); c.id="tele-cur"; c.setAttribute("aria-hidden","true");
    c.innerHTML=`<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M4 2.5v17.2l4.6-4.1 3 6.6 3.4-1.5-3-6.5h6.2z" fill="#fff" stroke="#141432" stroke-width="1.6" stroke-linejoin="round"/></svg><i></i>`;
    const h=document.createElement("div"); h.id="tele-hl"; h.setAttribute("aria-hidden","true");
    document.body.appendChild(h); document.body.appendChild(c); }
  function drawCursor(){
    ensureOverlay();
    const c=$id("tele-cur"), h=$id("tele-hl"); c.style.setProperty("--s",clamp(Math.round(vw()*.022),26,52)+"px");
    c.style.transform=`translate(${H.x}px,${H.y}px)`; c.classList.add("on");
    const t=under(H.x,H.y);
    if(t){ const r=t.getBoundingClientRect(); h.style.cssText=`left:${r.left-4}px;top:${r.top-4}px;width:${r.width+8}px;height:${r.height+8}px`; h.classList.add("on"); }
    else h.classList.remove("on");
    clearTimeout(H.idle); H.idle=setTimeout(()=>{ c.classList.remove("on"); h.classList.remove("on"); },6000); }
  function ripple(){ ensureOverlay(); const r=document.createElement("i"); r.className="tele-rip"; r.style.left=H.x+"px"; r.style.top=H.y+"px";
    document.body.appendChild(r); setTimeout(()=>{ if(r.parentNode)r.parentNode.removeChild(r); },600); }
  function fire(el,type,x,y){
    try{ const Ev=window.PointerEvent||window.MouseEvent; el.dispatchEvent(new Ev(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,pointerId:1,pointerType:"mouse",button:0,view:window})); }catch(e){} }
  function activate(t,x,y){
    ripple();
    if(t.tagName==="INPUT"&&t.type==="range"){ const r=t.getBoundingClientRect(), p=clamp((x-r.left)/Math.max(1,r.width),0,1), mn=+t.min||0, mx=+t.max||100, st=+t.step||1;
      t.value=String(clamp(Math.round((mn+p*(mx-mn))/st)*st,mn,mx)); t.dispatchEvent(new Event("input",{bubbles:true})); t.dispatchEvent(new Event("change",{bubbles:true})); return true; }
    fire(t,"pointerdown",x,y); fire(t,"pointerup",x,y);
    if(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)){ try{ t.focus(); }catch(e){} if(t.type==="checkbox"||t.type==="radio")t.click(); }
    else t.click();
    return true; }
  function clickAt(x,y){ const t=under(x,y); if(!t){ ripple(); return false; } return activate(t,x,y); }
  function go(el){ if(!el)return; try{ el.scrollIntoView({block:"nearest",inline:"nearest"}); }catch(e){} const c=centerOf(el); H.x=c.x; H.y=c.y; drawCursor(); }
  function navigate(d){
    const cur=under(H.x,H.y);
    if(cur&&cur.tagName==="INPUT"&&cur.type==="range"&&(d==="left"||d==="right")){
      const st=+cur.step||1, mn=+cur.min||0, mx=+cur.max||100; cur.value=String(clamp((+cur.value||0)+(d==="right"?st:-st),mn,mx));
      cur.dispatchEvent(new Event("input",{bubbles:true})); cur.dispatchEvent(new Event("change",{bubbles:true})); drawCursor(); return; }
    const from=cur?centerOf(cur):{x:H.x,y:H.y};
    const run=()=>pickDir(from,clickables().filter(e=>e!==cur).map(e=>Object.assign({el:e},centerOf(e))),d);
    let hit=run();
    if(!hit&&(d==="up"||d==="down")){ const s=scroller(cur||document.body), before=s.scrollTop; s.scrollBy?s.scrollBy(0,(d==="down"?1:-1)*vh()*.7):(s.scrollTop+=(d==="down"?1:-1)*vh()*.7);
      if(s.scrollTop!==before)hit=run(); }
    if(hit){ go(hit.el); return; }
    if(!cur){ const first=clickables()[0]; if(first)go(first); } }
  function backAction(){
    const m=$id("modal"); if(m&&m.classList.contains("on")){ try{ closeModal(); }catch(e){} return; }
    const pop=document.querySelector(".arc-gpop"); if(pop){ const b=pop.querySelector("button"); if(b)b.click(); return; }
    const q=$id("ls-quit"), sc=document.querySelector(".screen.on");
    if(sc&&sc.id==="sc-lesson"&&q){ q.click(); return; }
    if(sc&&sc.id!=="sc-path"&&typeof setTab==="function")setTab("path"); }
  function choices(){ const l=Array.from(document.querySelectorAll("#qwrap .choice")).filter(e=>!e.disabled&&e.getBoundingClientRect().width>0); return l; }
  function typeKey(k){
    let el=document.activeElement; if(!el||!/^(INPUT|TEXTAREA)$/.test(el.tagName)||el.type==="range")el=$id("numin");
    if(!el)return;
    const v=el.value; el.value=k==="back"?v.slice(0,-1):k==="clear"?"":v+k;
    el.dispatchEvent(new Event("input",{bubbles:true})); try{ el.focus(); }catch(e){} }
  function snap(){
    const sc=(document.querySelector(".screen.on")||{}).id||"", lesson=sc==="sc-lesson";
    const btn=$id("btn-check"), done=(typeof A!=="undefined"&&A&&A.done);
    let chk=null; if(lesson&&btn&&btn.getBoundingClientRect().width>0)chk={txt:(btn.textContent||"").trim().slice(0,14),en:!btn.disabled};
    let ch=[]; if(lesson&&!done)ch=choices().slice(0,8).map((e,i)=>{ const k=e.querySelector(".kk"); return (k?k.textContent:(e.textContent||"")).replace(/[^A-Za-zÀ-ÿ0-9]/g,"").slice(0,5)||String.fromCharCode(65+i); });
    const num=!!(lesson&&!done&&$id("numin")), m=$id("modal");
    let q=null; try{ q=hooks.spec?hooks.spec():null; }catch(e){ q=null; }
    return {sc,chk,ch,num,modal:!!(m&&m.classList.contains("on")),q}; }
  function pushState(force){ if(!H.rt)return; const s=JSON.stringify(snap()); if(!force&&s===H.last)return; H.last=s; H.rt.send({r:"h",t:"state",s:JSON.parse(s)}); }
  function hostMsg(m){
    if(!H.on||!m||m.r!=="p")return;
    H.seen=Date.now(); H.hasPhone=true;
    switch(m.t){
      case "hello": case "ping": H.rt.send({r:"h",t:"pong"}); pushState(true); break;
      case "move": H.x=clamp(H.x+(+m.dx||0),0,vw()-2); H.y=clamp(H.y+(+m.dy||0),0,vh()-2); drawCursor(); break;
      case "tap": clickAt(H.x,H.y); break;
      case "ok": { const t=under(H.x,H.y); if(t){ const c=centerOf(t); activate(t,c.x,c.y); } else ripple(); break; }
      case "dir": navigate(m.d); break;
      case "scroll": { const s=scroller(under(H.x,H.y)||document.elementFromPoint&&document.elementFromPoint(H.x,H.y)||document.body); s.scrollBy?s.scrollBy(0,+m.dy||0):(s.scrollTop+=+m.dy||0); drawCursor(); break; }
      case "key": typeKey(String(m.k||"")); break;
      case "ch": { const e=choices()[+m.i]; if(e){ const c=centerOf(e); H.x=c.x; H.y=c.y; drawCursor(); activate(e,c.x,c.y); } break; }
      case "check": { const b=$id("btn-check"); if(b&&!b.disabled&&b.getBoundingClientRect().width>0){ ripple(); b.click(); } break; }
      case "back": backAction(); break;
      case "home": { const m2=$id("modal"); if(m2&&m2.classList.contains("on")){ try{ closeModal(); }catch(e){} } const sc=document.querySelector(".screen.on"); if(sc&&sc.id==="sc-lesson"){ const q=$id("ls-quit"); if(q)q.click(); } else if(typeof setTab==="function")setTab("path"); break; }
      case "bye": H.hasPhone=false; break;
      default: try{ if(hooks.msg)hooks.msg(m); }catch(e){}
    }
    setTimeout(()=>pushState(false),120);
    hostUi(); }
  function hostUi(){
    const ok=H.on&&H.hasPhone&&Date.now()-H.seen<10000;
    const p=$id("tele-pill");
    if(H.on){ if(!p){ const d=document.createElement("button"); d.id="tele-pill"; d.type="button"; d.onclick=()=>window.teleOpen(); document.body.appendChild(d); }
      const q=$id("tele-pill"); q.className=ok?"ok":"wait"; q.innerHTML=`<i></i>${ok?"Télécommande connectée":"Télécommande : en attente du téléphone"}`; }
    else if(p)p.remove();
    const st=$id("tele-stat"); if(st){ st.className="tele-stat "+(ok?"ok":"wait"); st.textContent=ok?"Téléphone connecté, tu peux t'asseoir dans le canapé.":(H.link?"En attente du téléphone...":"Connexion au serveur..."); } }
  function hostStart(){
    if(H.on)return;
    H.on=true; H.code=newCode(); H.hasPhone=false; H.seen=0; H.last="";
    H.x=Math.round(vw()/2); H.y=Math.round(vh()/2);
    H.rt=rtOpen(H.code,hostMsg,ok=>{ H.link=ok; hostUi(); });
    clearInterval(H.timer); H.timer=setInterval(()=>{ pushState(false); if(H.hasPhone&&Date.now()-H.seen>=10000){ H.hasPhone=false; } hostUi(); },600);
    keepAwake(H); ensureOverlay(); hostUi(); }
  function hostStop(){
    if(!H.on)return; try{ if(hooks.stop)hooks.stop(); }catch(e){} H.on=false; clearInterval(H.timer); clearTimeout(H.idle);
    try{ H.rt&&H.rt.send({r:"h",t:"bye"}); }catch(e){} setTimeout(()=>{ try{ H.rt&&H.rt.close(); }catch(e){} H.rt=null; },150);
    freeAwake(H); ["tele-cur","tele-hl","tele-pill"].forEach(i=>{ const e=$id(i); if(e)e.remove(); }); H.hasPhone=false; }

  /* ---------------- 4. COTE TELEPHONE : l'ecran telecommande ---------------- */
  const P={on:false,code:"",rt:null,link:false,seen:0,st:null,ping:null,wl:null,keys:false,keysAuto:true};
  function myPid(){ let v=""; try{ v=localStorage.getItem("learno_tele_pid")||""; }catch(e){} if(!/^[A-Z2-9]{6}$/.test(v)){ v=newCode(); try{ localStorage.setItem("learno_tele_pid",v); }catch(e){} } return v; }
  const AR={up:"M5 15l7-7 7 7",down:"M5 9l7 7 7-7",left:"M15 5l-7 7 7 7",right:"M9 5l7 7-7 7"};
  const arrow=d=>`<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="${AR[d]}" stroke="url(#arcGw)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  const SV={back:`<path d="M9 7 4 12l5 5M4 12h11a5 5 0 0 1 5 5" stroke="url(#arcGw)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    home:`<path d="M3 11.5 12 4l9 7.5M6 10v10h4.5v-5h3v5H18V10" stroke="url(#arcGw)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    keys:`<rect x="3" y="6" width="18" height="12" rx="3" stroke="url(#arcGw)" stroke-width="2.2" fill="none"/><path d="M7 10h.01M11 10h.01M15 10h.01M17.5 10h.01M8 14h8" stroke="url(#arcGw)" stroke-width="2.4" stroke-linecap="round" fill="none"/>`,
    up:`<path d="M12 19V6M6 11l6-6 6 6" stroke="url(#arcGw)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    down:`<path d="M12 5v13M6 13l6 6 6-6" stroke="url(#arcGw)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`};
  const ico=k=>`<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">${SV[k]}</svg>`;
  const buzz=n=>{ try{ if(navigator.vibrate)navigator.vibrate(n||8); }catch(e){} };
  function pSend(o){ if(P.rt)return P.rt.send(Object.assign({r:"p"},o)); return false; }
  function remoteUi(){
    const r=$id("tele-rc"); if(!r)return;
    const ok=P.link&&Date.now()-P.seen<9000;
    r.classList.toggle("ok",ok);
    $id("rc-stat").textContent=ok?"Connecté au PC":(P.link?"Recherche du PC...":"Connexion...");
    const s=P.st||{}, main=$id("rc-main");
    if(main){ const t=s.chk?s.chk.txt:"OK"; main.textContent=t||"OK"; main.disabled=!!(s.chk&&!s.chk.en); }
    const ch=$id("rc-ch"); if(ch){ const a=s.ch||[]; const key=a.join("|"); if(ch.dataset.k!==key){ ch.dataset.k=key; ch.innerHTML=a.map((l,i)=>`<button type="button" class="rc-c" data-i="${i}">${esc(l)}</button>`).join(""); } ch.style.display=a.length?"flex":"none"; }
    const num=!!s.num; if(P.keysAuto&&P.keys!==num){ P.keys=num; }
    r.classList.toggle("keys",P.keys);
    try{ if(hooks.render)hooks.render(); }catch(e){ if(window.console)console.error("telequiz",e); } }
  function remoteMsg(m){
    if(!P.on||!m||m.r!=="h")return;
    P.seen=Date.now();
    if(m.t==="state")P.st=m.s;
    if(m.t==="bye"){ P.seen=0; }
    remoteUi(); }
  function buildRemote(){
    if($id("tele-rc"))return;
    const d=document.createElement("div"); d.id="tele-rc";
    d.innerHTML=`<div class="rc-top"><span class="rc-dot"></span><b id="rc-stat">Connexion...</b><button type="button" id="rc-free" hidden>Curseur</button><button type="button" id="rc-quit">Quitter</button></div>
      <div id="rc-q" class="rc-q"></div>
      <div class="rc-mainrow"><button type="button" id="rc-main" class="rc-main">OK</button></div>
      <div id="rc-ch" class="rc-chs" style="display:none"></div>
      <div id="rc-pad" class="rc-pad"><span>Glisse pour déplacer le curseur<br>Touche pour cliquer<br>Deux doigts pour défiler</span></div>
      <div class="rc-mid"><div class="rc-dp">
        <button type="button" class="rc-d u" data-d="up" aria-label="Haut">${arrow("up")}</button>
        <button type="button" class="rc-d l" data-d="left" aria-label="Gauche">${arrow("left")}</button>
        <button type="button" class="rc-d c" id="rc-ok" aria-label="Valider">OK</button>
        <button type="button" class="rc-d r" data-d="right" aria-label="Droite">${arrow("right")}</button>
        <button type="button" class="rc-d b" data-d="down" aria-label="Bas">${arrow("down")}</button></div></div>
      <div class="rc-row">
        <button type="button" class="rc-g" id="rc-back" aria-label="Retour">${ico("back")}<small>Retour</small></button>
        <button type="button" class="rc-g" id="rc-home" aria-label="Accueil">${ico("home")}<small>Accueil</small></button>
        <button type="button" class="rc-g" id="rc-su" aria-label="Défiler vers le haut">${ico("up")}<small>Haut</small></button>
        <button type="button" class="rc-g" id="rc-sd" aria-label="Défiler vers le bas">${ico("down")}<small>Bas</small></button>
        <button type="button" class="rc-g" id="rc-kb" aria-label="Pavé numérique">${ico("keys")}<small>Chiffres</small></button></div>
      <div class="rc-keys">${["7","8","9","4","5","6","1","2","3",",","0","-"].map(k=>`<button type="button" data-k="${k}">${k}</button>`).join("")}
        <button type="button" data-k="back" class="w">Effacer</button><button type="button" id="rc-go" class="w go">Valider</button></div>`;
    document.body.appendChild(d);
    document.body.classList.add("tele-phone");
    /* pave tactile */
    const pad=$id("rc-pad"), pts=new Map(); let t0=0, moved=0, multi=false, ax=0, ay=0, flush=null, lastSc=0;
    const send=()=>{ flush=null; if(ax||ay){ pSend({t:"move",dx:Math.round(ax),dy:Math.round(ay)}); ax=0; ay=0; } };
    pad.addEventListener("pointerdown",e=>{ e.preventDefault(); try{ pad.setPointerCapture(e.pointerId); }catch(_){}
      pts.set(e.pointerId,{x:e.clientX,y:e.clientY}); if(pts.size===1){ t0=Date.now(); moved=0; multi=false; } else multi=true; });
    pad.addEventListener("pointermove",e=>{ const p=pts.get(e.pointerId); if(!p)return; e.preventDefault();
      const dx=e.clientX-p.x, dy=e.clientY-p.y; p.x=e.clientX; p.y=e.clientY; moved+=Math.abs(dx)+Math.abs(dy);
      if(pts.size>=2){ multi=true; const n=Date.now(); lastSc+=dy; if(n-(pad._st||0)>40){ pad._st=n; pSend({t:"scroll",dy:Math.round(-lastSc*4)}); lastSc=0; } return; }
      const sp=Math.hypot(dx,dy), g=2.1+Math.min(3.2,sp*.22); ax+=dx*g; ay+=dy*g; if(!flush)flush=setTimeout(send,28); });
    const up=e=>{ if(!pts.has(e.pointerId))return; pts.delete(e.pointerId);
      if(pts.size===0){ if(!multi&&Date.now()-t0<300&&moved<12){ send(); pSend({t:"tap"}); buzz(10); } else send(); } };
    pad.addEventListener("pointerup",up); pad.addEventListener("pointercancel",up);
    /* croix directionnelle avec repetition */
    d.querySelectorAll(".rc-d[data-d]").forEach(b=>{ let rep=null, to=null;
      const stop=()=>{ clearTimeout(to); clearInterval(rep); };
      b.addEventListener("pointerdown",e=>{ e.preventDefault(); const dir=b.dataset.d; pSend({t:"dir",d:dir}); buzz(8); to=setTimeout(()=>{ rep=setInterval(()=>pSend({t:"dir",d:dir}),150); },380); });
      ["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,stop)); });
    $id("rc-ok").addEventListener("click",()=>{ pSend({t:"ok"}); buzz(12); });
    $id("rc-main").addEventListener("click",()=>{ const s=P.st||{}; if(s.chk)pSend({t:"check"}); else pSend({t:"ok"}); buzz(14); });
    $id("rc-back").addEventListener("click",()=>{ pSend({t:"back"}); buzz(); });
    $id("rc-home").addEventListener("click",()=>{ pSend({t:"home"}); buzz(); });
    const sc=(b,dy)=>{ let rep=null; const go=()=>pSend({t:"scroll",dy}); b.addEventListener("pointerdown",e=>{ e.preventDefault(); go(); rep=setInterval(go,120); }); ["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,()=>clearInterval(rep))); };
    sc($id("rc-su"),-260); sc($id("rc-sd"),260);
    $id("rc-kb").addEventListener("click",()=>{ P.keysAuto=false; P.keys=!P.keys; remoteUi(); });
    d.querySelectorAll(".rc-keys [data-k]").forEach(b=>b.addEventListener("click",()=>{ pSend({t:"key",k:b.dataset.k}); buzz(6); }));
    $id("rc-go").addEventListener("click",()=>{ pSend({t:"check"}); buzz(14); });
    $id("rc-ch").addEventListener("click",e=>{ const b=e.target.closest(".rc-c"); if(b){ pSend({t:"ch",i:+b.dataset.i}); buzz(12); } });
    $id("rc-quit").addEventListener("click",()=>remoteStop());
    ["touchmove","gesturestart"].forEach(ev=>d.addEventListener(ev,e=>{ if(e.target.closest&&e.target.closest("#rc-pad"))e.preventDefault(); },{passive:false})); }
  function remoteStart(code){
    code=cleanCode(code); if(code.length<6){ NOTE("Le code fait 6 caractères."); return false; }
    if(P.on)remoteStop();
    P.on=true; P.free=false; P.pid=myPid(); P.code=code; P.link=false; P.seen=0; P.st=null; P.keys=false; P.keysAuto=true;
    try{ if(typeof closeModal==="function")closeModal(); }catch(e){}
    buildRemote();
    P.rt=rtOpen(code,remoteMsg,ok=>{ P.link=ok; if(ok){ pSend({t:"hello"}); } remoteUi(); });
    clearInterval(P.ping); P.ping=setInterval(()=>{ if(P.rt&&P.rt.ok)pSend({t:"ping"}); else if(P.rt)P.rt.wake(); remoteUi(); },3000);
    keepAwake(P); remoteUi(); return true; }
  function remoteStop(){
    if(!P.on)return; try{ pSend({t:"bye"}); }catch(e){}
    const rt=P.rt; setTimeout(()=>{ try{ rt&&rt.close(); }catch(e){} },150);
    P.on=false; P.rt=null; clearInterval(P.ping); freeAwake(P);
    const r=$id("tele-rc"); if(r)r.remove(); document.body.classList.remove("tele-phone"); }
  document.addEventListener("visibilitychange",()=>{ if(document.visibilityState!=="visible")return;
    if(P.on){ P.rt&&P.rt.wake(); keepAwake(P); } if(H.on){ H.rt&&H.rt.wake(); keepAwake(H); } });

  /* ---------------- 5. FENETRE DE CHOIX ---------------- */
  function panelHome(){
    openModal(`<h2 class="arc-h" style="margin:0 0 6px;text-align:left">Télécommande</h2>
      <p class="tele-p">Branche le PC sur la télé en HDMI, ouvre Learno dessus, puis joue depuis le canapé avec ton téléphone.</p>
      <button type="button" class="tele-big" onclick="teleHost()">${tile("tele",52,"#1CB0F6")}<span><b>Ce PC est branché sur la télé</b><small>Affiche le code à entrer sur ton téléphone</small></span></button>
      <button type="button" class="tele-big" onclick="telePhone()">${tile("tele",52,"#58CC02")}<span><b>Ce téléphone est la télécommande</b><small>Entre le code affiché sur le PC</small></span></button>
      <button class="btn ghost" onclick="closeModal()">Fermer</button>`); }
  function panelHost(){
    hostStart();
    const url=location.origin+location.pathname+"?tele="+H.code;
    openModal(`<h2 class="arc-h" style="margin:0 0 6px;text-align:left">Sur ton téléphone</h2>
      <ol class="tele-ol"><li>Ouvre Learno sur ton téléphone, puis <b>Plus</b> et <b>Télécommande</b>.</li><li>Entre ce code, ou scanne le QR code avec l'appareil photo.</li></ol>
      <div class="tele-card">${qrSvg(url,168)}<div class="tele-code" aria-label="Code de la télécommande">${H.code.split("").join("<i></i>")}</div></div>
      <div class="tele-stat wait" id="tele-stat">Connexion au serveur...</div>
      <div class="tele-btns"><button type="button" class="btn blue" onclick="teleFull()">Plein écran</button>
        <button type="button" class="btn ghost" onclick="closeModal()">Réduire</button>
        <button type="button" class="btn red" onclick="teleStop()">Arrêter</button></div>
      <div id="tele-multi-slot"></div>
      <p class="tele-p small">Astuce télé : plein écran, puis Ctrl et + pour agrandir. Le téléphone ne reçoit rien de ton compte, il envoie seulement des touches.</p>`);
    try{ if(hooks.hostPanel)hooks.hostPanel(); }catch(e){ if(window.console)console.error("telearena",e); }
    hostUi(); }
  function panelPhone(pre){
    openModal(`<h2 class="arc-h" style="margin:0 0 6px;text-align:left">Code du PC</h2>
      <p class="tele-p">Sur le PC, ouvre Learno, puis Télécommande et « Ce PC est branché sur la télé ». Recopie le code de 6 caractères.</p>
      <input id="tele-in" class="tele-in" inputmode="text" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" maxlength="6" placeholder="K7M2QX" value="${esc(pre||"")}">
      <button type="button" class="btn" onclick="teleJoin()">Connecter</button>
      <button class="btn ghost" onclick="teleOpen()">Retour</button>`);
    const i=$id("tele-in"); if(i){ i.addEventListener("input",()=>{ i.value=cleanCode(i.value); }); i.addEventListener("keydown",e=>{ if(e.key==="Enter")window.teleJoin(); }); setTimeout(()=>{ try{ i.focus(); }catch(e){} },80); } }
  window.teleOpen=function(){ if(H.on)panelHost(); else panelHome(); };
  window.teleHost=panelHost; window.telePhone=()=>panelPhone("");
  window.teleJoin=()=>{ const i=$id("tele-in"); remoteStart(i?i.value:""); };
  window.teleStop=()=>{ hostStop(); try{ closeModal(); }catch(e){} NOTE("Télécommande arrêtée."); };
  window.teleFull=()=>{ try{ const e=document.documentElement; (e.requestFullscreen||e.webkitRequestFullscreen).call(e); }catch(err){} };
  window.__tele={hooks,H,P,$id,esc,clamp,pSend,pickDir,qrMatrix,qrSvg,newCode,cleanCode,snap,hostMsg,remoteMsg,remoteStart,remoteStop,hostStop,rtOpen};

  /* ---------------- 6. POINTS D'ENTREE ---------------- */
  const __mt=window.moreTabs;
  if(typeof __mt==="function"){
    window.moreTabs=function(){ __mt.apply(null,arguments);
      try{ const box=document.querySelector("#mcard .arc-more"); if(box&&!box.querySelector("[data-tele]")){
        box.insertAdjacentHTML("beforeend",`<button type="button" data-tele="1" onclick="teleOpen()">${tile("tele",48,"#1CB0F6")}Télécommande</button>`); } }catch(e){} };
  }
  const __rn=window.renderNav;
  function sideEntry(){ try{ const s=$id("side"); if(s&&!s.querySelector("#tele-side")){
    s.insertAdjacentHTML("beforeend",`<button class="navitem" id="tele-side" type="button" onclick="teleOpen()"><span class="ic">${glyph("tele",22)}</span>Télécommande</button>`); } }catch(e){} }
  if(typeof __rn==="function"){ window.renderNav=function(){ __rn.apply(null,arguments); sideEntry(); }; }
  sideEntry();
  /* lien du QR code : ?tele=CODE ouvre directement la telecommande */
  try{ const q=new URLSearchParams(location.search).get("tele");
    if(q){ const c=cleanCode(q); try{ history.replaceState(null,"",location.pathname+location.hash); }catch(e){}
      if(c.length===6)setTimeout(()=>remoteStart(c),700); } }catch(e){}
})();
