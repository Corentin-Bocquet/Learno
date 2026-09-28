/*UNIT*/
{id:282,c:"ECHECS",n:"Module 4",t:"Notation et valeur des pièces : compter avant d'échanger",col:"--purple",ic:"🔢",guide:`
<h3>Ce que tu dois savoir faire</h3>
<ul><li>Lire et écrire un coup en <b>notation algébrique</b>.</li>
<li>Donner la <b>valeur</b> de chaque pièce.</li>
<li>Calculer le <b>bilan d'un échange</b> avant de le faire.</li>
<li>Savoir ce qu'est la <b>qualité</b> et la <b>paire de fous</b>.</li></ul>
<h3>La feuille de partie de Baptiste</h3>
<div class="gstory">Baptiste te montre sa feuille de partie d'hier soir, fier : « J'ai pris son cavalier avec ma tour ! » Tu regardes : 18.Txe5 dxe5. Il a donné sa tour (5 points) pour un cavalier (3 points). Viktor, qui passait par là, tapote la feuille : « Le point commun de la plupart des parties perdues sous 1000 Elo : un échange mal compté. »</div>
<h3>La notation algébrique</h3>
<table><tr><th>Symbole</th><th>Sens</th><th>Exemple</th></tr>
<tr><td>R, D, T, F, C</td><td>Roi, Dame, Tour, Fou, Cavalier (le pion n'a pas de lettre)</td><td>Cf3 : cavalier en f3</td></tr>
<tr><td>x</td><td>Prise</td><td>Fxc6 : le fou prend en c6</td></tr>
<tr><td>+</td><td>Échec</td><td>Dh5+</td></tr>
<tr><td>#</td><td>Mat</td><td>Dxf7#</td></tr>
<tr><td>O-O / O-O-O</td><td>Petit roque / grand roque</td><td>O-O</td></tr>
<tr><td>=D</td><td>Promotion en dame</td><td>e8=D</td></tr>
<tr><td>! et ?</td><td>Bon coup / erreur (?? : gaffe)</td><td>Cf6??</td></tr></table>
<p>Un coup de pion s'écrit seulement avec sa case d'arrivée : <b>e4</b>. Une prise de pion précise sa colonne de départ : <b>exd5</b>. Les numéros comptent les coups : 1.e4 e5 2.Cf3 Cc6.</p>
<div class="gtrap">Sur Lichess ou Chess.com en anglais, les lettres changent : K (King, roi), Q (Queen, dame), R (Rook, tour), B (Bishop, fou), N (Knight, cavalier). Attention : en français R = roi, en anglais R = tour.</div>
<h3>La valeur des pièces</h3>
<table><tr><th>Pièce</th><th>Valeur</th></tr>
<tr><td>Pion</td><td>1</td></tr>
<tr><td>Cavalier</td><td>3</td></tr>
<tr><td>Fou</td><td>3</td></tr>
<tr><td>Tour</td><td>5</td></tr>
<tr><td>Dame</td><td>9</td></tr>
<tr><td>Roi</td><td>infini</td></tr></table>
<div class="gmnemo">Les valeurs en une ligne : <b>« 1, 3, 3, 5, 9 »</b>. Imagine un escalier : le pion sur la marche 1, les deux pièces légères sur la 3, la tour sur la 5, la dame tout en haut sur la 9.</div>
<h3>Compter avant chaque échange</h3>
<ul><li>Avant de prendre, compte les <b>attaquants</b> et les <b>défenseurs</b> de la case.</li>
<li>Additionne ce que tu gagnes et ce que tu perds dans toute la séquence.</li>
<li>N'échange jamais une pièce <b>plus forte</b> contre une plus faible <b>sans contrepartie claire</b> : mat forcé, attaque décisive, pion passé gagnant.</li></ul>
<div class="formula">Baptiste : Txe5 (prend un cavalier, + 3), puis dxe5 (perd la tour, - 5)
Bilan : 3 - 5 = - 2</div>
<h3>La qualité et la paire de fous</h3>
<ul><li>Gagner une tour contre une pièce légère (fou ou cavalier), c'est <b>gagner la qualité</b> : + 2.</li>
<li>Deux fous ensemble couvrent les cases des deux couleurs : la <b>paire de fous</b> vaut souvent un peu plus que 6. Garde-la quand tu peux.</li></ul>
<h3>Ce que tu dois retenir</h3>
<ul><li>R, D, T, F, C, x, +, #, O-O. En anglais, K, Q, R, B, N.</li>
<li>1, 3, 3, 5, 9.</li>
<li>Compter avant chaque échange, jamais d'échange perdant sans contrepartie.</li>
<li>Qualité = + 2, paire de fous un peu plus que 6.</li></ul>`},
/*EXOS*/
{i:"e282_01",u:282,t:"match",d:.2,nw:"La notation algébrique",q:"Associe chaque symbole à son sens.",p:[["x","Prise"],["+","Échec"],["#","Mat"],["O-O","Petit roque"]],w:"Quatre symboles de base de la feuille de partie."},
{i:"e282_02",u:282,t:"fill",d:.25,q:"Le coup « le cavalier va en f3 » s'écrit ___.",o:["Cf3","Rf3","f3C","Nf3C"],a:0,w:"Lettre de la pièce, puis case d'arrivée : Cf3."},
{i:"e282_03",u:282,t:"mcq",d:.3,q:"Comment s'écrit « le pion e avance en e4 » ?",o:["e4","Pe4","pe2-e4","e2e4P"],a:0,w:"Le pion n'a pas de lettre : seulement la case d'arrivée."},
{i:"e282_04",u:282,t:"sort",d:.3,q:"Quelle pièce joue ce coup ?",bins:["Cavalier","Fou","Pion"],it:[["Cc3",0],["Fb5",1],["d4",2],["Cxe5",0],["exd5",2],["Fxf7+",1]],w:"C cavalier, F fou, pas de lettre pour le pion."},
{i:"e282_05",u:282,t:"tf",d:.3,q:"Dans la notation anglaise, la lettre R désigne le roi.",a:false,w:"En anglais, R = Rook, la tour. Le roi est K (King)."},
{i:"e282_06",u:282,t:"match",d:.35,q:"Associe chaque lettre anglaise à la pièce.",p:[["K","Roi"],["Q","Dame"],["B","Fou"],["N","Cavalier"]],w:"King, Queen, Bishop, Knight. R, Rook, est la tour."},
{i:"e282_07",u:282,t:"story",d:.35,q:"Que signifie ce coup sur la feuille de Léna ?",sc:[{who:"Léna",txt:"J'ai noté 23.Dxf7#. Tu sais lire ?"}],o:["La dame prend en f7 et fait mat","La dame va en f7 et donne échec","Le roi prend en f7","La dame est prise en f7"],a:0,w:"D dame, x prise, f7 la case, # mat. C'est un mat du berger, vu au module 10."},
{i:"e282_08",u:282,t:"fill",d:.4,q:"Deux points d'interrogation « ?? » après un coup signalent une ___.",o:["gaffe","prise","promotion","nulle"],a:0,w:"? pour une erreur, ?? pour une gaffe, ! pour un bon coup."},
{i:"e282_09",u:282,t:"tiles",d:.35,nw:"La valeur des pièces",q:"Reconstitue l'échelle des valeurs, du pion à la dame.",a:["1,","3,","3,","5,","9"],dd:["4,","7,","10,"],w:"Pion 1, cavalier 3, fou 3, tour 5, dame 9."},
{i:"e282_10",u:282,t:"match",d:.4,q:"Associe chaque pièce à sa valeur.",p:[["Pion","1"],["Cavalier","3"],["Tour","5"],["Dame","9"]],w:"L'escalier 1, 3, 3, 5, 9. Le fou, lui, vaut 3 comme le cavalier."},
{i:"e282_11",u:282,t:"slider",d:.4,q:"Combien vaut un fou ?",min:1,max:9,step:1,a:3,tol:0,pre:"",un:" points",w:"Comme le cavalier : 3 points. Les pièces légères valent 3 chacune."},
{i:"e282_12",u:282,t:"tf",d:.4,q:"Le roi vaut 10 points.",a:false,w:"Le roi a une valeur infinie : le perdre, c'est perdre la partie."},
{i:"e282_13",u:282,t:"num",d:.45,nw:"Compter un échange",q:"Baptiste prend un cavalier avec sa tour, puis perd sa tour. Quel est son bilan en points ?",a:-2,tol:0,un:" points",h:"+ 3 puis - 5",w:"3 - 5 = - 2 : un échange mal compté. Il fallait voir que le pion reprenait la tour."},
{i:"e282_14",u:282,t:"story",d:.45,q:"Que dis-tu à Baptiste ?",sc:[{who:"Baptiste",txt:"J'ai pris son cavalier avec ma tour, c'était un bon coup !"}],o:["Non : tu perds la tour, bilan - 2","Oui, prendre une pièce est toujours bon","Oui, un cavalier vaut plus qu'une tour","Non, parce qu'un cavalier vaut 7 points"],a:0,w:"Compte avant chaque échange : qui défend la case ? Ici, le pion d6 reprenait."},
{i:"e282_15",u:282,t:"multi",d:.45,q:"Que faut-il compter avant de prendre ?",o:["Les attaquants de la case","Les défenseurs de la case","La valeur de chaque pièce échangée","Le temps restant à la pendule","Le nombre de coups joués"],a:[0,1,2],w:"Attaquants, défenseurs, valeurs : le bilan de toute la séquence."},
{i:"e282_16",u:282,t:"num",d:.5,q:"Tu prends une dame (9) avec ton fou, puis ton adversaire reprend ton fou. Bilan ?",a:6,tol:0,un:" points",h:"+ 9 - 3",w:"9 - 3 = + 6 : un excellent échange. Donner une pièce légère pour la dame est toujours gagnant."},
{i:"e282_17",u:282,t:"sort",d:.5,q:"Échange favorable ou défavorable ?",bins:["Favorable","Défavorable"],it:[["Donner un fou pour une tour",0],["Donner une tour pour un cavalier",1],["Donner un cavalier pour une dame",0],["Donner une dame pour un fou",1],["Donner un pion pour un cavalier",0]],w:"On gagne quand ce qu'on reçoit vaut plus que ce qu'on donne."},
{i:"e282_18",u:282,t:"mcq",d:.5,q:"Quand peut-on donner une pièce plus forte contre une plus faible ?",o:["Avec une contrepartie claire","Jamais, dans aucun cas","Toujours, si on est pressé","Seulement en début de partie"],a:0,w:"Mat forcé, attaque décisive, pion passé gagnant : sinon, jamais."},
{i:"e282_19",u:282,t:"fill",d:.5,nw:"La qualité",q:"Gagner une tour contre un fou ou un cavalier s'appelle gagner la ___.",o:["qualité","paire","promotion","fourchette"],a:0,w:"La qualité : + 2 points. On dit aussi perdre la qualité quand c'est l'inverse."},
{i:"e282_20",u:282,t:"num",d:.5,q:"Combien de points gagne-t-on en gagnant la qualité ?",a:2,tol:0,un:" points",h:"5 - 3",w:"Tour 5 contre pièce légère 3 : + 2. C'est souvent décisif en finale."},
{i:"e282_21",u:282,t:"tf",d:.55,nw:"La paire de fous",q:"Deux fous ensemble valent souvent un peu plus que 6 points.",a:true,w:"Ils couvrent les cases des deux couleurs : la paire de fous est un avantage durable."},
{i:"e282_22",u:282,t:"story",d:.55,q:"Que conseilles-tu à Léna ?",sc:[{who:"Léna",txt:"Je peux échanger mon fou contre son cavalier, c'est 3 contre 3. Ça ne change rien ?"}],o:["Tu perds ta paire de fous : garde-la si tu peux","Aucune différence, 3 pour 3 c'est toujours égal","Tu gagnes 2 points en le faisant","Tu perds la qualité"],a:0,w:"En points c'est égal, mais la paire de fous vaut un peu plus que 6."},
{i:"e282_23",u:282,t:"order",d:.5,q:"Remets dans l'ordre le calcul d'un échange.",it:["Repérer la case de l'échange","Compter attaquants et défenseurs","Dérouler la séquence de prises","Additionner gains et pertes","Décider de prendre ou non"],w:"Case, forces, séquence, bilan, décision."},
{i:"e282_24",u:282,t:"num",d:.55,q:"Tu échanges ta tour et un pion contre une dame. Bilan ?",a:3,tol:0,un:" points",h:"9 - (5 + 1)",w:"9 - 6 = + 3. Une dame vaut plus qu'une tour et un pion."},
{i:"e282_25",u:282,t:"story",d:.55,q:"Rappel du module 2 : que signifie « e8=D+ » ?",sc:[{who:"Baptiste",txt:"C'est quoi, ce coup bizarre ?"}],o:["Un pion promu en dame en e8, avec échec","Une dame qui recule en e8","Un roque côté dame","Une prise en passant en e8"],a:0,w:"=D promotion en dame, + échec. La promotion s'écrit avec le signe égal."},
{i:"e282_26",u:282,t:"multi",d:.6,q:"Quelles contreparties justifient de donner du matériel ?",o:["Un mat forcé","Une attaque décisive","Un pion passé gagnant","Gagner du temps à la pendule","Faire plaisir à l'adversaire"],a:[0,1,2],w:"Le sacrifice doit rapporter plus qu'il ne coûte."},
{i:"e282_27",u:282,t:"tf",d:.6,q:"Un échange « 3 contre 3 » entre fou et cavalier est toujours exactement équivalent.",a:false,w:"La paire de fous, la position et l'activité des pièces comptent aussi."},
{i:"e282_28",u:282,t:"fill",d:.6,q:"Le petit roque s'écrit O-O, le grand roque s'écrit ___.",o:["O-O-O","O-O-O-O","OO","O-3"],a:0,w:"Trois O pour le côté le plus long, celui de la dame."},
{i:"e282_29",u:282,t:"story",d:.6,q:"Rappel du module 3 : que dis-tu ?",ctx:"Léna a une tour et un roi contre un roi seul. Baptiste lui dit que c'est nul.",sc:[{who:"Baptiste",txt:"Tour et roi contre roi, c'est nul comme un fou seul, non ?"}],o:["Non : la tour suffit pour mater","Oui, matériel insuffisant","Oui, sauf si elle a aussi un pion","Non, mais il faut une dame"],a:0,w:"Roi et tour contre roi : gagné avec la bonne méthode (module 9). Le fou ou le cavalier seuls, eux, ne matent pas."},
{i:"e282_30",u:282,t:"mcq",d:.65,q:"Tu as perdu une tour et gagné un fou et deux pions. Où en es-tu ?",o:["À égalité","À + 2","À - 2","À + 4"],a:0,w:"3 + 1 + 1 = 5 : autant que la tour. Compte toujours en points pour savoir où tu en es."},
{i:"e282_31",u:282,t:"sort",d:.65,q:"Rappel des modules 1 et 4 : français ou anglais ?",bins:["Notation française","Notation anglaise"],it:[["Cf3",0],["Nf3",1],["Fc4",0],["Bc4",1],["Dh5",0],["Qh5",1]],w:"C/N cavalier, F/B fou, D/Q dame. Sur les sites en anglais, lis bien la lettre."},
{i:"e282_32",u:282,t:"story",d:.65,q:"Synthèse : Viktor te pose la question clé.",sc:[{who:"Viktor Sokolov",txt:"Avant de prendre, tu fais quoi ?"}],o:["« Je compte attaquants, défenseurs et bilan »","« Je prends tout de suite, une pièce est une pièce »","« Je regarde si la pièce est jolie »","« Je demande à l'adversaire s'il est d'accord »"],a:0,w:"1, 3, 3, 5, 9 et un bilan de toute la séquence : la base pour ne plus perdre de matériel bêtement."}
