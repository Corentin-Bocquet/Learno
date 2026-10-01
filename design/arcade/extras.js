/* =====================================================================
   COUCHE CONFORT (01/10/2026), demandes de Corentin
   1. Calculatrice : multiplication implicite 2(3+4), puissance, carré,
      racine, ln, log, eˣ, pourcentage, pi, Ans, aperçu en direct.
   2. Plusieurs réponses justes : formules équivalentes (a + b = b + a),
      phrases équivalentes (liste ALTS), nombres arrondis correctement,
      nombres écrits « 1 234,5 », « 1234.5 € » ou sous forme de calcul.
   3. Corrections lisibles : listes et tableaux au lieu de « A → B · C → D »,
      une phrase par ligne, formules des leçons sans flèches ASCII.
   4. Glossaire « En clair » : mots du métier soulignés, toucher pour lire
      une définition simple et un exemple (données : glossaire.js).
   5. Énoncés de cas pratiques présentés en fiche, chiffres en évidence,
      tableau possible via le champ optionnel ex.tab des futurs cours.
   6. Potions : jauge et minuteur en haut de l écran, durées 20 à 45 min.
   7. Gel de série plus cher (150 gemmes).
   8. Épreuve légendaire obligatoire pour ouvrir le module suivant.
   9. La leçon s affiche aussi quand on enchaîne deux quiz.
   10. iPhone : pas de zoom au double toucher, pas de bande morte en bas.
   Tout passe par des enveloppes : aucun cours, aucune règle de jeu n est
   réécrit. Aucun emoji littéral ici (voir CLAUDE.md).
   ===================================================================== */
(function confort(){
  const $id=id=>document.getElementById(id);
  const fr=n=>String(n).replace(".",",");
  const cidNow=()=>(typeof L!=="undefined"&&L&&L.cid)||S.active;

  /* ---------------- 1. CALCULATRICE ---------------- */
  const CX={exp:"",ans:null,res:null};
  const FNS1={"ln":x=>Math.log(x),"log":x=>Math.log10(x),"exp":x=>Math.exp(x),"√":x=>Math.sqrt(x)};
  function tokens(s){
    const t=[]; let i=0;
    while(i<s.length){
      const c=s[i];
      if(/\s/.test(c)){ i++; continue; }
      if(/[0-9.,]/.test(c)){ let j=i; while(j<s.length&&/[0-9.,]/.test(s[j]))j++;
        const raw=s.slice(i,j).replace(/,/g,"."); if((raw.match(/\./g)||[]).length>1||raw===".")throw new Error("nombre");
        t.push({k:"n",v:parseFloat(raw)}); i=j; continue; }
      if(s.startsWith("Ans",i)){ t.push({k:"n",v:CX.ans==null?0:CX.ans}); i+=3; continue; }
      if(c==="π"){ t.push({k:"n",v:Math.PI}); i++; continue; }
      const f=["ln","log","exp","√"].find(n=>s.startsWith(n,i));
      if(f){ t.push({k:"f",v:f}); i+=f.length; continue; }
      if(c==="e"){ t.push({k:"n",v:Math.E}); i++; continue; }
      if("+-−×*xX÷/:^()%²".includes(c)){ t.push({k:"o",v:({"−":"-","*":"×","x":"×","X":"×","/":"÷",":":"÷"})[c]||c}); i++; continue; }
      throw new Error("symbole");
    }
    /* multiplication implicite : 2(3+4), (1+r)(1+r), 3π, 2√9, 5ln(2) */
    const out=[];
    t.forEach(x=>{ const p=out[out.length-1];
      const fin=p&&(p.k==="n"||(p.k==="o"&&(p.v===")"||p.v==="%"||p.v==="²")));
      const deb=x.k==="n"||x.k==="f"||(x.k==="o"&&x.v==="(");
      if(fin&&deb)out.push({k:"o",v:"×"});
      out.push(x); });
    return out;
  }
  function calcEval(src){
    let s=String(src||""); const o=(s.match(/\(/g)||[]).length, c=(s.match(/\)/g)||[]).length;
    s+=")".repeat(Math.max(0,o-c));
    const tk=tokens(s); let i=0;
    const peek=()=>tk[i], eat=v=>{ const t=tk[i]; if(t&&t.k==="o"&&t.v===v){ i++; return true; } return false; };
    function expr(){ let a=term();
      for(;;){ if(eat("+")){ const b=term(); a={v:b.pct?a.v+a.v*b.v:a.v+b.v}; }
        else if(eat("-")){ const b=term(); a={v:b.pct?a.v-a.v*b.v:a.v-b.v}; }
        else return a; } }
    function term(){ let a=unary();
      for(;;){ if(eat("×"))a={v:a.v*unary().v}; else if(eat("÷"))a={v:a.v/unary().v}; else return a; } }
    function unary(){ if(eat("-")){ const r=unary(); return {v:-r.v,pct:r.pct}; } if(eat("+"))return unary(); return power(); }
    function power(){ const b=post(); if(eat("^")){ const e=unary(); return {v:Math.pow(b.v,e.v)}; } return b; }
    function post(){ let a=prim();
      for(;;){ if(eat("%"))a={v:a.v/100,pct:true}; else if(eat("²"))a={v:a.v*a.v}; else return a; } }
    function prim(){ const t=peek(); if(!t)throw new Error("fin");
      if(t.k==="n"){ i++; return {v:t.v}; }
      if(t.k==="f"){ i++; const a=post(); return {v:FNS1[t.v](a.v)}; }
      if(eat("(")){ const v=expr(); if(!eat(")"))throw new Error("parenthese"); return {v:v.v}; }
      throw new Error("syntaxe"); }
    const r=expr(); if(i!==tk.length)throw new Error("reste");
    if(typeof r.v!=="number"||!isFinite(r.v))throw new Error("infini");
    return r.v;
  }
  window.arcCalcEval=calcEval;
  const nfmt=v=>{ if(!isFinite(v))return "erreur"; let s=String(Number(v.toPrecision(12))); if(/e/.test(s))s=v.toPrecision(10); return s.replace(".",","); };
  const KEYS=[
    ["ln","ln(","fn"],["eˣ","exp(","fn"],["log","log(","fn"],["xʸ","^","fn"],["x²","²","fn"],
    ["√","√(","fn"],["π","π","fn"],["%","%","fn"],["(","(","op"],[")",")","op"],
    ["7","7"],["8","8"],["9","9"],["DEL","","del"],["C","","del"],
    ["4","4"],["5","5"],["6","6"],["×","×","op"],["÷","÷","op"],
    ["1","1"],["2","2"],["3","3"],["+","+","op"],["−","-","op"],
    ["0","0"],[",",","],["Ans","Ans","fn"],["=","","eq"]];
  function calcPaint(){
    const e=$id("calc-exp"), r=$id("calc-res"), u=$id("calc-use"); if(!e)return;
    e.textContent=(CX.exp||"0").replace(/-/g,"−");
    let prev=null; if(CX.res==null&&CX.exp){ try{ prev=calcEval(CX.exp); }catch(err){} }
    r.textContent=CX.res!=null?nfmt(CX.res):(prev!=null&&/[^0-9,.]/.test(CX.exp)?"= "+nfmt(prev):"");
    r.classList.toggle("pv",CX.res==null);
    u.innerHTML=(CX.res!=null&&$id("numin"))?`<button class="btn" type="button" onclick="calcUse()">Utiliser ${nfmt(CX.res)} comme réponse</button>`:"";
  }
  window.openCalc=function(){
    if($id("calc-wrap"))return;
    const w=document.createElement("div"); w.id="calc-wrap"; w.className="calcwrap arc-calc";
    w.onclick=e=>{ if(e.target===w)closeCalc(); };
    w.innerHTML=`<div class="calcpanel" role="dialog" aria-label="Calculatrice">
      <div class="arc-chead"><span>Calculatrice</span><button class="tbtn" type="button" onclick="closeCalc()">Fermer</button></div>
      <div class="calcscr"><div class="calcexp" id="calc-exp">0</div><div class="calcres" id="calc-res"></div></div>
      <div class="arc-cgrid">${KEYS.map((k,i)=>`<button type="button" class="ckey ${k[2]||""}" data-i="${i}" ${k[0]==="="?'style="grid-column:span 2"':""} aria-label="${k[0]==="DEL"?"Effacer":k[0]}">${k[0]==="DEL"?"⌫":k[0]}</button>`).join("")}</div>
      <div id="calc-use" style="margin-top:10px"></div>
      <p class="muted arc-chint">2(3+4) se calcule sans le signe ×. xʸ pour une puissance, % pour un pourcentage (200 + 10 % = 220).</p></div>`;
    w.querySelector(".arc-cgrid").addEventListener("click",e=>{ const b=e.target.closest(".ckey"); if(!b)return; press(KEYS[+b.dataset.i]); });
    (document.getElementById("sc-lesson")||document.body).appendChild(w);
    calcPaint();
  };
  function press(k){
    if(!k)return; const n=k[0];
    if(n==="C"){ CX.exp=""; CX.res=null; }
    else if(n==="DEL"){ if(CX.res!=null){ CX.res=null; } else CX.exp=CX.exp.replace(/(Ans|ln\(|log\(|exp\(|√\(|.)$/,""); }
    else if(n==="="){ if(!CX.exp)return; try{ CX.res=calcEval(CX.exp); CX.ans=CX.res; sfx("correct"); }catch(err){ CX.res=null; toast("Calcul impossible : vérifie l'expression."); } }
    else{ if(CX.res!=null){ CX.exp=/^[+\-×÷^%²]/.test(k[1])?"Ans":""; CX.res=null; } CX.exp+=k[1]; }
    sfx("click"); calcPaint();
  }
  window.calcKey=function(k){ CX.exp+=k; CX.res=null; calcPaint(); };
  window.calcClear=function(){ CX.exp=""; CX.res=null; calcPaint(); };
  window.calcEq=function(){ press(["=","","eq"]); };
  window.calcUse=function(){
    const v=CX.res; if(v==null)return; const i=$id("numin");
    if(i){ i.value=nfmt(v); i.dispatchEvent(new Event("input",{bubbles:true})); }
    closeCalc(); sfx("complete"); toast(ico("check",18)+" Réponse remplie avec "+nfmt(v)+".");
  };
  document.addEventListener("keydown",e=>{
    if(!$id("calc-wrap")||e.metaKey||e.ctrlKey||e.altKey)return;
    const m={"Enter":"=","=":"=","Backspace":"DEL","Escape":"ESC","Delete":"C","*":"×","x":"×","/":"÷","-":"−",".":",","^":"xʸ"};
    const n=m[e.key]||e.key; if(n==="ESC"){ closeCalc(); return; }
    const k=KEYS.find(x=>x[0]===n); if(k){ e.preventDefault(); press(k); }
  });

  /* ---------------- 2. PLUSIEURS REPONSES JUSTES ---------------- */
  const nrm=s=>String(s||"").normalize("NFC").toLowerCase().replace(/[’‘`]/g,"'").replace(/[.,;:!?«»"“”()\[\]]/g," ").replace(/\s+/g," ").trim();
  /* phrases a reconstituer qui ont une autre formulation juste (relu le 01/10/2026) */
  const ALTS={
    "29l":["habille-toi pour l'heure le lieu et les gens présents"],
    "98h":["toujours le packaging avant le script"],
    "59h":["on cherche l'écart entre l'équilibre et la stratégie adverse"],
    "60i":["blancs sur 31 à 50 noirs sur 1 à 20"],
    "75f":["ne plus voir des pions mais des tempos et des cases contrôlées"],
    "124i":["au lieu de les recevoir créer ses propres valeurs"],
    "131l":["en étant malade il écrit ses livres les plus violents"],
    "62h":["vérifier avant chaque coup ce que l'adversaire pourrait prendre après"],
    "34j":["une expérience ne se discute pas un avis se discute"],
    "130i":["l'ivresse seule est illisible la forme seule est vide"],
    "n162_31":["l'amf surveille les marchés l'acpr les prêts et les assurances"],
    "o167_21":["je dis oui parce que je le peux et le veux"],
    "o171_06":["oui à la personne non à la demande"],
    "a188_11":["un litre et demi dans le verre un litre dans l'assiette"],
    "a191_30":["colza pour assaisonner olive pour cuire"],
    "a192_09":["un fruit et un légume à chaque repas","à chaque repas un légume et un fruit","à chaque repas un fruit et un légume"],
    "t236_10":["slice pour le piège lift pour la marge"],
    "m217_26":["la cage pour lui le centre pour moi"],
    "m220_24":["par-dessus tu te défends sous le bras tu contrôles"],
    "k266_12":["indirect il faut passer direct tu peux marquer"],
    "k276_06":["les xg pèsent les tirs comptent"],
    "e281_10":["pat pas en échec et coincé mat en échec et coincé"],
    "e286_15":["petite derrière grosse devant"],
    "e290_09":["pion derrière roi devant"],
    "f263_02":["obligation = prêteur action = associé"],
    "f263_09":["fcp copropriété sicav société"]
  };
  /* formules : on compare la valeur, pas l ordre des briques */
  const OPS=new Set(["+","-","−","x","×","*","/","÷","=","(",")",";","^"]);
  const FNS2={max:Math.max,min:Math.min,ln:x=>Math.log(Math.abs(x)+1e-12),log:x=>Math.log10(Math.abs(x)+1e-12),exp:Math.exp,
    racine:x=>Math.sqrt(Math.abs(x)),sqrt:x=>Math.sqrt(Math.abs(x)),N:x=>1/(1+Math.exp(-1.7*x))};
  function atoms(tiles){
    const out=[]; let buf=[];
    const flush=()=>{ if(buf.length){ out.push({k:"a",v:buf.join(" ")}); buf=[]; } };
    tiles.forEach(w=>{ w=String(w).trim(); if(!w)return;
      if(OPS.has(w)){ flush(); out.push({k:"o",v:({"−":"-","×":"x","*":"x","÷":"/"})[w]||w}); return; }
      const m=/^([A-Za-z]+)\($/.exec(w); if(m&&FNS2[m[1]]){ flush(); out.push({k:"f",v:m[1]}); out.push({k:"o",v:"("}); return; }
      buf.push(w); });
    flush();
    return out.map((t,i)=>t.k==="a"&&FNS2[t.v]&&out[i+1]&&out[i+1].v==="("?{k:"f",v:t.v}:t);
  }
  function hval(a,seed){ let h=2166136261^seed; for(let k=0;k<a.length;k++){ h^=a.charCodeAt(k); h=Math.imul(h,16777619); } return 1.2+((h>>>0)%100000)/100000*2.6; }
  function evalAt(tk,seed){
    let i=0; const eat=v=>{ const t=tk[i]; if(t&&t.k==="o"&&t.v===v){ i++; return true; } return false; };
    const val=a=>/^-?\d+([.,]\d+)?$/.test(a)?parseFloat(a.replace(",",".")):hval(a,seed);
    function E(){ let v=T(); for(;;){ if(eat("+"))v+=T(); else if(eat("-"))v-=T(); else return v; } }
    function T(){ let v=U(); for(;;){ if(eat("x"))v*=U(); else if(eat("/"))v/=U(); else if(tk[i]&&(tk[i].k==="f"||(tk[i].k==="o"&&tk[i].v==="(")))v*=U(); else return v; } }
    function U(){ if(eat("-"))return -U(); if(eat("+"))return U(); return P(); }
    function P(){ const b=R(); if(eat("^"))return Math.pow(b,U()); return b; }
    function R(){ const t=tk[i]; if(!t)throw 0;
      if(t.k==="a"){ i++; return val(t.v); }
      if(t.k==="f"){ i++; if(!eat("("))throw 0; const args=[E()]; while(eat(";"))args.push(E()); if(!eat(")"))throw 0; return FNS2[t.v].apply(null,args); }
      if(eat("(")){ const v=E(); if(!eat(")"))throw 0; return v; }
      throw 0; }
    const v=E(); if(i!==tk.length)throw 0; return v;
  }
  function formulaEq(u,a){
    try{
      const sides=t=>{ const p=[[]]; atoms(t).forEach(x=>{ if(x.k==="o"&&x.v==="=")p.push([]); else p[p.length-1].push(x); }); return p; };
      const U=sides(u), Aa=sides(a); if(U.length!==Aa.length||U.some(p=>!p.length))return false;
      const sig=p=>[11,23,37].map(s=>evalAt(p,s)), su=U.map(sig), sa=Aa.map(sig);
      if(su.concat(sa).some(v=>v.some(x=>!isFinite(x))))return false;
      const same=(x,y)=>x.every((v,k)=>Math.abs(v-y[k])<=1e-9*(1+Math.abs(v)));
      const pris=[];
      return su.every(x=>{ const k=sa.findIndex((y,j)=>pris.indexOf(j)<0&&same(x,y)); if(k<0)return false; pris.push(k); return true; });
    }catch(e){ return false; }
  }
  const formuleQ=ex=>ex.t==="eq"||(ex.t==="tiles"&&ex.a.some(w=>/^[+\-−x×*\/÷=]$/.test(String(w).trim())));
  function tilesOk(ex,u){
    const us=nrm(u.join(" "));
    if(us===nrm(ex.a.join(" ")))return true;
    if((ALTS[ex.i]||[]).concat(ex.alts||[]).some(x=>nrm(Array.isArray(x)?x.join(" "):x)===us))return true;
    return formuleQ(ex)&&formulaEq(u,ex.a);
  }
  function numVal(raw){
    let s=String(raw==null?"":raw).replace(/[\s\u00a0\u202f]/g,"").replace(/€|%|euros?|eur/gi,"");
    if(!s)return NaN;
    if(/[+×*÷/^()²]|[0-9)]-|x/i.test(s.replace(/^-/,""))){ try{ return calcEval(s); }catch(e){ return NaN; } }
    if(s.indexOf(",")>=0&&s.indexOf(".")>=0)s=s.replace(/\./g,"");
    const v=parseFloat(s.replace(",",".")); return isFinite(v)?v:NaN;
  }
  function numOk(ex,raw){
    const v=numVal(raw), a=+ex.a, tol=ex.tol||.01; if(!isFinite(v))return false;
    if(Math.abs(v-a)<=tol)return true;
    if((ex.alt||[]).some(x=>Math.abs(v-x)<=tol))return true;
    /* un arrondi correct est juste : 1 234,57 arrondi à 1 235 */
    const dec=(/[.,](\d+)\s*$/.exec(String(raw).replace(/[^0-9.,]/g,""))||[,""])[1].length, f=Math.pow(10,dec);
    return Math.abs(v-Math.round(a*f)/f)<1e-9&&Math.abs(v-a)<=Math.max(tol,.005*Math.abs(a));
  }
  window.arcTilesOk=tilesOk; window.arcNumOk=numOk; window.arcFormulaEq=formulaEq;

  /* ---------------- 3. CORRECTIONS LISIBLES ---------------- */
  function sentences(t){
    t=String(t||"").replace(/\s+/g," ").trim(); if(!t)return [];
    const out=[]; let deb=0; const re=/[.!?]\s+(?=[A-ZÀ-ÖØ-Þ«0-9])/g; let m;
    while((m=re.exec(t))){ const avant=t.slice(deb,m.index+1);
      if(/(?:\b(?:art|M|Mme|cf|env|av|apr|etc|ex|p|vs|St|n°)|\d)\.$/.test(avant))continue;
      out.push(avant.trim()); deb=m.index+m[0].length; }
    out.push(t.slice(deb).trim()); return out.filter(Boolean);
  }
  function formatW(w){
    w=String(w||"").trim(); if(!w)return "";
    const s=sentences(w);
    if(s.length<2||w.length<110)return `<span class="arc-wtxt">${esc(w)}</span>`;
    return `<span class="arc-wtxt arc-wsplit">${s.map(x=>`<span>${esc(x)}</span>`).join("")}</span>`;
  }
  function solBlock(ex){
    const E=esc;
    if(ex.t==="match"&&ex.p)return `<div class="arc-solk">Les bonnes paires</div><div class="arc-soltab">${ex.p.map(p=>`<div class="r"><span>${E(p[0])}</span><span>${E(p[1])}</span></div>`).join("")}</div>`;
    if(ex.t==="sort"&&ex.bins)return `<div class="arc-solk">Le bon classement</div>${ex.bins.map((b,bi)=>{ const its=ex.it.filter(x=>x[1]===bi);
      return its.length?`<div class="arc-solbin"><b>${E(b)}</b><div>${its.map(x=>`<span>${E(x[0])}</span>`).join("")}</div></div>`:""; }).join("")}`;
    if(ex.t==="order"&&ex.it)return `<div class="arc-solk">Le bon ordre</div><ol class="arc-solol">${ex.it.map(s=>`<li>${E(s)}</li>`).join("")}</ol>`;
    if(ex.t==="multi"&&ex.o)return `<div class="arc-solk">Les bonnes réponses</div><ul class="arc-solul">${ex.a.map(k=>`<li>${E(ex.o[k])}</li>`).join("")}</ul>`;
    if(ex.t==="look"&&ex.slots)return `<div class="arc-solk">La tenue attendue</div><div class="arc-soltab">${ex.slots.map(sl=>`<div class="r"><span>${E(sl.n)}</span><span>${E(sl.items[sl.a].n)}</span></div>`).join("")}</div>`;
    return "";
  }
  function prettyVerdict(){
    if(typeof L==="undefined"||!L||L.mode==="exam"||!A||!A.ex)return;
    const cb=$id("checkbar"); if(!cb)return;
    const bad=cb.classList.contains("bad"), good=cb.classList.contains("good"); if(!bad&&!good)return;
    const vw=cb.querySelector(".vw"); if(!vw||vw.dataset.pretty)return; vw.dataset.pretty="1";
    const ex=A.ex, b=bad?solBlock(ex):"", old=vw.querySelector(".arc-sol");
    vw.innerHTML=(b?`<div class="arc-solbox">${b}</div>`:old?old.outerHTML:"")+formatW(ex.w);
    glossIn(vw,L.cid);
  }

  /* ---------------- 4. LECONS : formules et fleches ---------------- */
  const ARW='<span class="arc-arw" role="img" aria-label="donne"></span>';
  function prettyLesson(root){
    if(!root)return;
    root.querySelectorAll(".formula").forEach(f=>{
      if(f.dataset.pf)return; f.dataset.pf="1"; f.classList.add("arc-fml");
      const lignes=f.innerHTML.replace(/^\s*\n+|\n+\s*$/g,"").split("\n");
      f.innerHTML=lignes.map(l=>{
        if(!l.trim())return '<span class="fl gap"></span>';
        const ind=/^(\s*)/.exec(l)[1].length; let h=l.trim();
        h=h.replace(/\s*(?:-&gt;|=&gt;|→|⇒)\s*/g," "+ARW+" ").replace(/(\S) x (?=\S)/g,"$1 × ");
        const m=/^([^:<>=;&]{2,40}?)\s:\s*(.*)$/.exec(h);
        if(m&&!/\d$/.test(m[1]))h=`<span class="fk">${m[1]} :</span> ${m[2]}`;
        return `<span class="fl"${ind?` style="padding-left:${Math.min(4,Math.ceil(ind/2))*12}px"`:""}>${h}</span>`;
      }).join("");
    });
    const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>/->|=>|→/.test(n.data)&&!(n.parentElement&&n.parentElement.closest(".formula,script,style"))?1:2});
    const ns=[]; while(tw.nextNode())ns.push(tw.currentNode);
    ns.forEach(n=>{ const fr=document.createDocumentFragment();
      n.data.split(/\s*(?:->|=>|→)\s*/).forEach((p,k)=>{ if(k){ const s=document.createElement("span"); s.className="arc-arw"; s.setAttribute("role","img"); s.setAttribute("aria-label","donne"); fr.appendChild(document.createTextNode(" ")); fr.appendChild(s); fr.appendChild(document.createTextNode(" ")); } fr.appendChild(document.createTextNode(p)); });
      n.parentNode.replaceChild(fr,n); });
  }

  /* ---------------- 5. GLOSSAIRE « EN CLAIR » ---------------- */
  const GL=window.ARC_GLOSS||[], GC={};
  const MAJ=/\p{Lu}/u;
  function glossFor(cid){
    if(GC[cid])return GC[cid];
    const list=[];
    GL.forEach((g,gi)=>{ if(g.c&&g.c.split(" ").indexOf(cid)<0)return; [g.t].concat(g.f||[]).forEach(f=>list.push({f,gi})); });
    if(!list.length)return GC[cid]={re:null,map:{}};
    list.sort((a,b)=>b.f.length-a.f.length);
    const re=new RegExp("(?<![\\p{L}\\p{N}-])("+list.map(x=>x.f.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")(?![\\p{L}\\p{N}-])","giu");
    const map={}; list.forEach(x=>{ const k=x.f.toLowerCase(); (map[k]=map[k]||[]).push(x); });
    return GC[cid]={re,map};
  }
  const GSKIP="button,summary,a,.formula,.gterm,script,style,svg,textarea,input,select,h1,h2,.kk,.ck,.arc-sol,.arc-solbox,.choice,.tile,.chip,.sortbin,.arc-gpop";
  function glossIn(root,cid,seen){
    if(!root||!GL.length||!cid)return; const G=glossFor(cid); if(!G.re)return;
    seen=seen||new Set();
    const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{ if(!n.data||n.data.length<2)return 2; const p=n.parentElement; return p&&!p.closest(GSKIP)?1:2; }});
    const ns=[]; while(tw.nextNode())ns.push(tw.currentNode);
    ns.forEach(n=>{
      const s=n.data; G.re.lastIndex=0; let m, last=0, frag=null;
      while((m=G.re.exec(s))){
        const t=m[1], c=(G.map[t.toLowerCase()]||[]).find(x=>!MAJ.test(x.f)||x.f===t);
        if(!c||seen.has(c.gi))continue; seen.add(c.gi);
        frag=frag||document.createDocumentFragment();
        frag.appendChild(document.createTextNode(s.slice(last,m.index)));
        const b=document.createElement("span"); b.className="gterm"; b.dataset.g=c.gi; b.setAttribute("role","button"); b.tabIndex=0;
        b.setAttribute("aria-label",t+" : voir l'explication"); b.textContent=t; frag.appendChild(b); last=m.index+t.length;
      }
      if(frag){ frag.appendChild(document.createTextNode(s.slice(last))); n.parentNode.replaceChild(frag,n); }
    });
  }
  window.arcGloss=glossIn;
  function gPop(el){
    const g=GL[+el.dataset.g]; if(!g)return; gClose();
    const d=document.createElement("div"); d.id="arc-gpop"; d.className="arc-gpop";
    d.innerHTML=`<div class="arc-gp-card" role="dialog" aria-label="${esc(g.t)}"><div class="k">${ico("lecon",14)} En clair</div>
      <div class="t">${esc(el.textContent)}</div><p>${esc(g.d)}</p>${g.x?`<div class="x"><b>Exemple</b>${esc(g.x)}</div>`:""}
      <button class="btn" type="button">Compris</button></div>`;
    d.addEventListener("click",e=>{ if(e.target===d||e.target.closest(".btn"))gClose(); });
    document.body.appendChild(d); sfx("click");
    requestAnimationFrame(()=>d.classList.add("on"));
  }
  function gClose(){ const p=$id("arc-gpop"); if(p)p.remove(); }
  document.addEventListener("click",e=>{ const t=e.target&&e.target.closest&&e.target.closest(".gterm"); if(!t)return; e.preventDefault(); e.stopPropagation(); gPop(t); },true);
  document.addEventListener("keydown",e=>{ if(e.key==="Escape")gClose();
    const t=e.target&&e.target.classList&&e.target.classList.contains("gterm")?e.target:null; if(t&&(e.key==="Enter"||e.key===" ")){ e.preventDefault(); gPop(t); } });

  /* ---------------- 5 bis. ENONCES EN FICHE ---------------- */
  function hiNum(t){
    return esc(t).replace(/\d{1,3}(?:[\s\u00a0\u202f]\d{3})+(?:,\d+)?(?:\s?(?:€|%|k€|M€|ans?|mois|m²|kcal|jours?|h))?|\d+(?:,\d+)?\s?(?:€|%|k€|M€|ans?|mois|m²|kcal|jours?)(?![\p{L}])/gu,m=>`<b class="arc-num">${m}</b>`);
  }
  function ctxHTML(ex){
    const ps=sentences(ex.ctx);
    let h="";
    if(ps.length>=2){
      h=`<div class="arc-ctx">${ps.map(p=>{ const m=/^([^:]{2,42}?)\s:\s(.+)$/.exec(p);
        return m&&!/\d{3}/.test(m[1])?`<div class="r kv"><span class="k">${esc(m[1])}</span><span class="v">${hiNum(m[2].replace(/\.$/,""))}</span></div>`:`<div class="r">${hiNum(p)}</div>`; }).join("")}</div>`;
    }
    if(Array.isArray(ex.tab)&&ex.tab.length){
      const [hd,...rows]=ex.tab;
      h=(h||(ex.ctx?`<div class="arc-ctx"><div class="r">${hiNum(ex.ctx)}</div></div>`:""))+`<div class="arc-tabwrap"><table class="arc-tab"><thead><tr>${hd.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${hiNum(String(c))}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    }
    return h;
  }

  /* ---------------- 6. POTIONS : nouvelles durees et jauge ---------------- */
  const PIMG=m=>m>=3?"potion3":m>=2?"potion2":"potion15";
  const PD={1.5:"XP multipliés par 1,5. Pour une longue session tranquille.",2:"XP doublés. Deux leçons suffisent à la rentabiliser.",3:"XP triplés. Pour un sprint de révision à fond."};
  if(typeof SHOP!=="undefined"&&Array.isArray(SHOP)&&!SHOP.find(x=>x.id==="p3d")){
    const ic={1.5:"\u{1F9EA}",2:"\u{2697}\u{FE0F}",3:"\u{1F525}"};
    [[1.5,45,85,"p15b"],[2,30,190,"p2b"],[2,45,270,"p2c"],[3,20,340,"p3b"],[3,30,490,"p3c"],[3,45,700,"p3d"]].forEach(([m,min,prix,id])=>
      SHOP.push({id,nm:"Potion ×"+fr(m),d:PD[m],m,min,prix,ic:ic[m]}));
  }
  const PSEL={};
  window.arcPotSel=function(m,id){ PSEL[m]=id; sfx("click"); renderShop(); };
  function potionCards(){
    return [1.5,2,3].map(m=>{
      const its=SHOP.filter(x=>x.m===m).sort((a,b)=>a.min-b.min); if(!its.length)return "";
      const sel=its.find(x=>x.id===PSEL[m])||its[0], stock=its.filter(x=>(inv()[x.id]||0)>0);
      return `<div class="shopit arc-pcard ${m===2?"hot":""}"><div class="si">${arcImg(PIMG(m),84)}</div>
        <div class="sn">Potion ×${fr(m)}</div><div class="sd">${PD[m]}</div>
        <div class="arc-pdur" role="group" aria-label="Durée de la potion">${its.map(x=>`<button type="button" class="${x===sel?"on":""}" aria-pressed="${x===sel}" onclick="arcPotSel(${m},'${x.id}')">${x.min} min</button>`).join("")}</div>
        <button class="btn ${S.gems>=sel.prix?"":"ghost"}" type="button" onclick="buyPotion('${sel.id}')">Acheter ${sel.min} min · ${sel.prix} ${ico("gem",16)}</button>
        ${stock.map(x=>`<button class="btn blue" type="button" onclick="drinkPotion('${x.id}')">Boire ${x.min} min (${inv()[x.id]} en stock)</button>`).join("")}</div>`;
    }).join("");
  }
  if(typeof drinkPotion==="function"){ const __dp=drinkPotion; window.drinkPotion=function(id){
    const avant=S.boost&&S.boost.until, on=boostOn(); __dp.apply(null,arguments);
    if(S.boost&&S.boost.until!==avant){ if(!on||!S.boost.t0)S.boost.t0=Date.now(); save(); }
    boostTick(); }; }
  function boostTick(){
    let el=$id("arc-boost"); const on=typeof boostOn==="function"&&boostOn(), center=$id("center");
    if(!on||!center){ if(el)el.remove(); return; }
    if(!el){ el=document.createElement("div"); el.id="arc-boost"; el.className="arc-boost";
      el.innerHTML=`<i class="g"><i></i></i><button type="button" class="pill" onclick="arcBoostTap()"><span class="im"></span><b></b><span class="t"></span><i class="mini"><i></i></i></button>`;
      center.appendChild(el); }
    const it=SHOP.find(x=>x.id===S.boost.id), left=S.boost.until-Date.now();
    const tot=Math.max(left,S.boost.t0?S.boost.until-S.boost.t0:(it?it.min:15)*60000), p=Math.max(0,Math.min(1,left/tot));
    const im=el.querySelector(".im"); if(im.dataset.m!==String(S.boost.m)){ im.dataset.m=String(S.boost.m); im.innerHTML=arcImg(PIMG(S.boost.m),22); }
    el.querySelector("b").textContent="×"+fr(S.boost.m);
    el.querySelector(".t").textContent=boostLeft();
    el.querySelectorAll(".g > i,.mini > i").forEach(x=>{ x.style.width=(p*100).toFixed(2)+"%"; });
    el.classList.toggle("low",left<120000);
    const focus=document.body.classList.contains("arc-focus");
    const ref=focus?document.querySelector(".screen.on .lhead,.screen.on .arc-ihead"):$id("mtop");
    const cr=center.getBoundingClientRect();
    const top=ref&&ref.getClientRects().length?ref.getBoundingClientRect().bottom-cr.top:8;
    el.style.top=Math.round(top)+"px";
    el.classList.toggle("focus",focus);
    el.setAttribute("aria-label","Potion ×"+fr(S.boost.m)+" active, encore "+boostLeft());
  }
  window.arcBoostTap=function(){ if(document.body.classList.contains("arc-focus")){ toast("Potion ×"+fr(S.boost.m)+" active : encore "+boostLeft()+"."); return; } setTab("shop"); };
  setInterval(boostTick,1000);

  /* ---------------- 7. GEL DE SERIE PLUS CHER ---------------- */
  const GEL=150;
  window.buyFreeze=function(){
    if(S.gems>=GEL){ S.gems-=GEL; S.freezes++; save(); if(typeof renderQuests==="function"&&$id("sc-quests")&&$id("sc-quests").classList.contains("on"))renderQuests(); refreshTop(); toast("Gel de série acheté."); }
    else toast("Pas assez de gemmes : il en faut "+GEL+".");
  };
  const gelFix=root=>{ if(!root)return; root.querySelectorAll('[onclick*="buyFreeze"]').forEach(b=>{
    if(b.dataset.gel)return; b.dataset.gel="1";
    b.innerHTML=b.closest(".shopit")?`Acheter · ${GEL} ${ico("gem",16)}`:`Acheter un gel de série (${GEL} ${ico("gem",14)})`;
    b.classList.toggle("ghost",S.gems<GEL); }); };

  /* ---------------- 8. EPREUVE LEGENDAIRE OBLIGATOIRE ---------------- */
  const crown=uid=>{ const u=unitOf(uid), c=u&&S.courses[u.c]; return !!(c&&c.crowns&&c.crowns[uid]); };
  const started=uid=>unitDone(uid)>0;
  /* un module deja commence reste ouvert : on ne reprend rien a personne */
  const __uu=unitUnlocked;
  window.unitUnlocked=function(uid){
    if(!__uu.apply(null,arguments))return false;
    const l=courseUnits(unitOf(uid).c), i=l.findIndex(u=>u.id===uid);
    return i<=0||crown(l[i-1].id)||started(uid);
  };
  function legendDue(cid){
    const us=courseUnits(cid);
    for(let k=0;k<us.length;k++){ const u=us[k];
      if(!unitComplete(u.id))return null;
      if(!crown(u.id)&&(!us[k+1]||!started(us[k+1].id)))return u; }
    return null;
  }
  window.nextLessonExists=function(){
    const c=S.courses[S.active]; if(!c)return null;
    const us=courseUnits(S.active);
    for(let k=0;k<us.length;k++){ const u=us[k];
      for(let i=0;i<lessonsIn(u.id);i++)if(!c.lessons[lkey(u.id,i)])return {u:u.id,l:i};
      if(!crown(u.id)&&(!us[k+1]||!started(us[k+1].id)))return {u:u.id,l:-1};
    }
    return null;
  };
  /* enchainer : la lecon (le cours) s affiche avant chaque quiz jamais fait */
  window.chainNext=function(){
    const n=nextLessonExists(); if(!n){ quitLesson(); return; }
    S.chain=(S.chain||0)+1;
    if(n.l<0){ startLesson(n.u,-1); return; }
    if(typeof arcStart==="function"){ if(typeof killCalc==="function")killCalc(); arcStart(n.u,n.l); } else startLesson(n.u,n.l);
  };
  if(typeof lockMsg==="function"){ const __lm=lockMsg; window.lockMsg=function(){
    const u=legendDue(S.active);
    if(u){ sfx("wrong"); toast(ico("crown",18)+" Réussis d'abord l'épreuve légendaire de « "+u.t+" » pour ouvrir la suite.",3800); return; }
    return __lm.apply(null,arguments); }; }
  function legendCTA(uid){
    const card=$id("mcard"); if(!card||card.querySelector(".arc-legcta"))return;
    const u=unitOf(uid), box=card;
    const first=box.querySelector("button.btn"); if(!first)return;
    const d=document.createElement("div"); d.className="arc-legcta";
    d.innerHTML=`<div class="m">${ico("crown",22,"var(--gold)")}<span><b>Dernière étape du module :</b> l'épreuve légendaire. 10 questions sans faute pour décrocher la couronne et ouvrir le module suivant.</span></div>
      <button class="btn gold" type="button" onclick="closeModal();startLesson(${uid},-1)">${ico("crown",18)} Passer l'épreuve légendaire</button>`;
    first.parentNode.insertBefore(d,first);
    box.querySelectorAll('button.btn[onclick*="chainNext"]').forEach(b=>b.remove());
    if(u)box.querySelectorAll('button.btn[onclick*="quitLesson"]').forEach(b=>{ b.classList.add("ghost"); b.textContent="Plus tard"; });
  }

  window.arcLegendCTA=legendCTA;

  /* ---------------- 10. IPHONE : zoom et bande morte ---------------- */
  function hauteur(){
    const de=document.documentElement;
    if(navigator.standalone!==true){ de.classList.remove("arc-fullh"); return; }
    const portrait=window.innerHeight>=window.innerWidth;
    const h=portrait?Math.max(window.innerHeight,screen.height):Math.max(window.innerHeight,screen.width);
    if(h>window.innerHeight+2){ de.style.setProperty("--arc-h",h+"px"); de.classList.add("arc-fullh"); }
    else de.classList.remove("arc-fullh");
  }
  hauteur(); window.addEventListener("resize",hauteur); window.addEventListener("orientationchange",()=>setTimeout(hauteur,250));
  /* double toucher rapide sur une touche : jamais de zoom (Safari ignore parfois touch-action) */
  let lastT=0;
  document.addEventListener("touchend",e=>{ const now=Date.now();
    if(now-lastT<350&&e.target&&e.target.closest&&e.target.closest(".ckey,.arc-pad button,.tile,.chip")){ e.preventDefault(); e.target.closest(".ckey,.arc-pad button,.tile,.chip").click(); }
    lastT=now; },{passive:false});

  /* ---------------- BRANCHEMENTS ---------------- */
  const __rq=renderQ;
  window.renderQ=function(ex){
    __rq.apply(null,arguments);
    try{
      const box=document.querySelector("#qwrap .ctxbox");
      if(box&&ex&&(ex.ctx||ex.tab)){ const h=ctxHTML(ex); if(h){ const ck=box.querySelector(".ck"); box.innerHTML=""; if(ck)box.appendChild(ck); box.insertAdjacentHTML("beforeend",h); box.classList.add("arc-ctxbox"); } }
      glossIn($id("qwrap"),cidNow());
    }catch(e){ if(window.console)console.error("enonce",e); }
  };
  const __dc=doCheck;
  window.doCheck=function(){
    let rendre=null, souple=false;
    try{
      if(typeof L!=="undefined"&&L&&A&&A.ex&&!A.done){ const ex=A.ex;
        if((ex.t==="tiles"||ex.t==="eq")&&A.tiles&&A.tiles.length){ const u=A.tiles.map(t=>t.w);
          if(u.join(" ")!==ex.a.join(" ")&&tilesOk(ex,u)){ const old=A.tiles; A.tiles=ex.a.map(w=>({w})); rendre=()=>{ A.tiles=old; }; souple=true; } }
        else if(ex.t==="num"&&A.val!=null){
          const v=parseFloat(String(A.val).replace(",",".").replace(/[^0-9eE.\-+]/g,""));
          if(!(isFinite(v)&&Math.abs(v-ex.a)<=(ex.tol||.01))&&numOk(ex,A.val)){ const old=A.val; A.val=String(ex.a); rendre=()=>{ A.val=old; }; souple=true; } }
      }
    }catch(e){}
    try{ __dc.apply(null,arguments); } finally{ if(rendre)rendre(); }
    try{
      prettyVerdict();
      const cb=$id("checkbar");
      if(souple&&cb&&cb.classList.contains("good")&&!cb.querySelector(".arc-alt")){
        const ex=A.ex, v=cb.querySelector(".verdict");
        const cours=ex.t==="num"?fr(ex.a)+(ex.un||""):ex.a.join(" ");
        if(v)v.insertAdjacentHTML("afterend",`<div class="arc-alt">${ico("check",16,"var(--green)")}<span>Ta formulation est juste aussi. Celle du cours : <b>${esc(cours)}</b></span></div>`);
      }
    }catch(e){ if(window.console)console.error("verdict",e); }
  };
  if(typeof examFinish==="function"){ const __ef=examFinish; window.examFinish=function(){
    const log=(typeof L!=="undefined"&&L&&L.exam&&L.exam.log||[]).slice();
    __ef.apply(null,arguments);
    try{ document.querySelectorAll("#exambody .exam-rev").forEach((r,i)=>{ const x=log[i], a=r.querySelector(".a"); if(!x||x.ok||!a)return;
      const ex=EXOS.find(z=>z.i===x.i)||{}, b=solBlock(ex);
      a.innerHTML=(b?`<div class="arc-solbox">${b}</div>`:x.sol?`<span class="arc-sol">${esc(String(x.sol).replace(/^Réponse\s*:/,"Bonne réponse :"))}</span>`:"")+formatW(ex.w); }); }catch(e){}
  }; }
  const __fin=finish;
  window.finish=function(){
    const snap=(typeof L!=="undefined"&&L)?{mode:L.mode,uid:L.uid}:null;
    __fin.apply(null,arguments);
    try{ if(snap&&snap.mode==="normal"&&snap.uid!=null&&unitComplete(snap.uid)&&!crown(snap.uid))legendCTA(snap.uid); }catch(e){}
  };
  if(typeof arcStart==="function"){ const __as=arcStart; window.arcStart=function(uid){
    const r=__as.apply(null,arguments);
    try{ const b=$id("introbody"); if(b&&$id("sc-intro").classList.contains("on")){ prettyLesson(b); glossIn(b,unitOf(uid).c); } }catch(e){}
    return r; }; }
  const __og=openGuide;
  window.openGuide=function(uid){
    __og.apply(null,arguments);
    try{ const w=document.querySelector("#mcard .gwrap"); if(w){ prettyLesson(w); glossIn(w,unitOf(uid).c); } }catch(e){}
  };
  const __rs=renderShop;
  window.renderShop=function(){
    __rs.apply(null,arguments);
    try{
      const body=$id("shopbody"); if(!body)return;
      const g=body.querySelector(".shopgrid"); if(g&&g.querySelector('[onclick^="buyPotion"]'))g.innerHTML=potionCards();
      gelFix(body);
      const gel=[...body.querySelectorAll(".shopit .sd")].find(x=>/journée manquée/.test(x.textContent));
      if(gel&&!gel.dataset.gel){ gel.dataset.gel="1"; gel.insertAdjacentHTML("beforeend"," Un gel est précieux : garde-le pour un vrai coup dur."); }
    }catch(e){ if(window.console)console.error("boutique",e); }
  };
  if(typeof renderQuests==="function"){ const __rq2=renderQuests; window.renderQuests=function(){ __rq2.apply(null,arguments); try{ gelFix($id("questsbody")); }catch(e){} }; }
  const __rpth=renderPath;
  window.renderPath=function(){ __rpth.apply(null,arguments); boostTick(); };
  const __sh=show;
  window.show=function(){ __sh.apply(null,arguments); gClose(); setTimeout(boostTick,0); };

  boostTick();
  if(typeof S!=="undefined"&&S&&$id("sc-path")&&$id("sc-path").classList.contains("on"))renderPath();
})();
