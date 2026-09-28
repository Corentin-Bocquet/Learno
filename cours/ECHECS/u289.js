/*UNIT*/
{id:289,c:"ECHECS",n:"Module 11",t:"Échecs, Prises, Menaces : la routine anti-gaffe",col:"--purple",ic:"🔎",guide:`
<h3>Ce que tu dois savoir faire</h3>
<ul><li>Appliquer la routine <b>Échecs, Prises, Menaces</b> à chaque coup.</li>
<li><b>Compter</b> attaquants et défenseurs avant un échange.</li>
<li>Repérer une pièce <b>en prise</b> ou <b>non défendue</b>.</li>
<li>Choisir une <b>cadence</b> qui te laisse le temps de réfléchir.</li></ul>
<h3>Le carnet de Baptiste</h3>
<div class="gstory">Viktor tend à Baptiste un petit carnet. Sur la couverture, trois mots : ÉCHECS, PRISES, MENACES. « Pendant une semaine, avant chaque coup, tu poses ces trois questions. Tu joues en 15+10, pas en 1 minute. » Baptiste râle, c'est lent. Sept jours plus tard, il revient : sept parties, cinq victoires. « Je n'ai presque plus rien laissé en prise. » Viktor : « Tu n'as pas appris un seul coup nouveau. Tu as juste arrêté de donner tes pièces. »</div>
<h3>La routine Échecs, Prises, Menaces</h3>
<ol><li><b>Échecs</b> : est-ce que je peux donner échec ?</li>
<li><b>Prises</b> : est-ce que je peux prendre quelque chose gratuitement ?</li>
<li><b>Menaces</b> : qu'est-ce que mon adversaire vient de menacer avec son dernier coup ?</li></ol>
<ul><li>Applique-la à <b>chaque coup</b>, y compris aux tiens : que pourra-t-il faire <b>après</b> mon coup ?</li>
<li>C'est <b>mécanique</b> et un peu lent au début, mais ça élimine la <b>grande majorité</b> des erreurs de débutant.</li></ul>
<div class="gmnemo"><b>É.P.M. : « Est-ce Puni ? Menace ! »</b> Ou pense à un pilote : avant de décoller, il fait sa <b>check-list</b>, même après mille vols.</div>
<h3>Compter un échange</h3>
<ul><li>Compte les <b>attaquants</b> et les <b>défenseurs</b> de la case.</li>
<li>Si les attaquants sont <b>plus nombreux</b>, la prise est souvent gagnante.</li>
<li>Prends avec ta <b>pièce la moins chère</b> d'abord.</li>
<li>Compare toujours les <b>valeurs</b> : prendre un pion défendu avec ta dame, c'est perdre 8 points.</li></ul>
<table><tr><th>Situation</th><th>Verdict</th></tr>
<tr><td>Pièce attaquée, <b>pas défendue</b></td><td>On la prend gratuitement</td></tr>
<tr><td>2 attaquants, 1 défenseur</td><td>On gagne souvent, si on prend avec la moins chère</td></tr>
<tr><td>1 attaquant, 1 défenseur</td><td>Échange, compte les valeurs</td></tr>
<tr><td>Prendre un pion défendu avec la dame</td><td>Perte de 8 points (9 contre 1)</td></tr></table>
<div class="formula">Bilan = valeurs gagnées - valeurs perdues</div>
<h3>Les pièces qui traînent</h3>
<ul><li>Une pièce <b>non défendue</b> est une cible pour toutes les fourchettes et découvertes.</li>
<li>Avant chaque coup, repère tes pièces qui <b>ne sont protégées par rien</b>.</li>
<li>Les joueurs anglais disent « loose pieces drop off » : les pièces qui traînent finissent par tomber.</li></ul>
<h3>La cadence</h3>
<ul><li>« <b>15+10</b> » veut dire 15 minutes par joueur, plus 10 secondes ajoutées à chaque coup joué.</li>
<li>Ta formation conseille <b>10+0 minimum</b>, idéalement <b>15+10</b>, tant que les bases ne sont pas automatiques.</li>
<li>Le <b>blitz</b> (3 à 5 minutes) et le <b>bullet</b> (1 minute) ne laissent pas le temps d'É.P.M.</li></ul>
<div class="gtrap">Ta formation dit que cette routine fait gagner « presque toutes les parties à bas niveau ». C'est l'avis des coachs, pas une statistique. Ce qui est sûr, c'est qu'elle supprime la plupart des gaffes, et que sous 1500 Elo la gaffe décide la majorité des parties.</div>
<h3>Ce que tu dois retenir</h3>
<ul><li>É.P.M. avant chaque coup, le tien comme le sien.</li>
<li>Compte attaquants et défenseurs, prends avec la moins chère.</li>
<li>Protège les pièces qui traînent.</li>
<li>Cadence longue, 15+10, tant que ce n'est pas automatique.</li></ul>`},
/*EXOS*/
{i:"e289_01",u:289,t:"order",d:.2,nw:"Échecs, Prises, Menaces",q:"Remets dans l'ordre la routine anti-gaffe.",it:["Échecs : puis-je donner échec ?","Prises : puis-je prendre gratuitement ?","Menaces : que vient-il de menacer ?"],w:"É.P.M. : la check-list du pilote, avant chaque coup."},
{i:"e289_02",u:289,t:"story",d:.2,q:"Que réponds-tu à Baptiste ?",sc:[{who:"Baptiste",txt:"É.P.M. à chaque coup ? C'est trop lent, je le ferai quand ça compte."}],o:["Chaque coup compte : une gaffe suffit","Oui, seulement pendant les finales","Oui, seulement quand tu es en échec","Non, une seule fois par partie suffit"],a:0,w:"C'est lent au début puis ça devient automatique. Et une seule gaffe perd la partie."},
{i:"e289_03",u:289,t:"fill",d:.25,q:"Le « M » de É.P.M. veut dire ___.",o:["Menaces","Mat","Milieu","Manœuvre"],a:0,w:"Qu'est-ce que mon adversaire vient de menacer avec son dernier coup ?"},
{i:"e289_04",u:289,t:"tf",d:.25,q:"La routine É.P.M. s'applique aussi à tes propres coups, avant de les jouer.",a:true,w:"Que pourra-t-il faire après mon coup ? C'est la vérification anti-gaffe."},
{i:"e289_05",u:289,t:"match",d:.3,q:"Associe chaque lettre à sa question.",p:[["É","Puis-je donner échec ?"],["P","Puis-je prendre gratuitement ?"],["M","Que vient-il de menacer ?"],["Après mon coup","Que pourra-t-il faire ?"]],w:"Trois questions, plus une vérification de ton propre coup."},
{i:"e289_06",u:289,t:"story",d:.3,q:"Que dis-tu à Léna ?",ctx:"Le dernier coup de l'adversaire : son fou vient en b4 et attaque ton cavalier c3. Ton roi est roqué en g1.",sc:[{who:"Léna",txt:"J'allais jouer mon attaque sur le roi, je continue ?"}],o:["Regarde d'abord ce que menace Fb4","Oui, l'attaque passe avant tout","Oui, un fou ne menace jamais rien","Non, abandonne l'attaque pour toujours"],a:0,w:"M comme Menaces : son dernier coup attaque ton cavalier. Vérifie s'il est défendu."},
{i:"e289_07",u:289,t:"num",d:.35,nw:"Compter un échange",q:"Tu prends un pion défendu (1) avec ta dame (9), et il reprend ta dame. Bilan ?",a:-8,tol:0,un:" points",h:"+ 1 - 9",w:"1 - 9 = - 8. Compte les défenseurs avant de prendre."},
{i:"e289_08",u:289,t:"mcq",d:.35,q:"Deux de tes pièces attaquent une case, une seule la défend. Avec quelle pièce prends-tu d'abord ?",o:["La moins chère","La plus chère","N'importe laquelle","Le roi, toujours"],a:0,w:"Si l'adversaire reprend, tu perds le moins possible, puis ta 2e pièce reprend."},
{i:"e289_09",u:289,t:"sort",d:.35,q:"Prise gagnante ou perdante ?",bins:["Gagnante","Perdante"],it:[["Cavalier non défendu, tu le prends avec un pion",0],["Pion défendu, tu le prends avec ta dame",1],["Tour défendue, tu la prends avec un fou",0],["Cavalier défendu, tu le prends avec ta tour",1]],w:"Compare ce que tu gagnes et ce que tu perds s'il reprend. Tour 5 contre fou 3 : + 2."},
{i:"e289_10",u:289,t:"tf",d:.4,q:"Si une pièce est attaquée deux fois et défendue une fois, la prendre est toujours gagnant.",a:false,w:"Pas toujours : si tu prends avec une pièce plus chère que la cible, tu peux perdre. Compte aussi les valeurs."},
{i:"e289_11",u:289,t:"num",d:.4,q:"Ton fou (3) prend un cavalier (3). Il reprend avec un pion. Ta tour (5) reprend le pion (1). Plus rien ne défend. Bilan ?",a:1,tol:0,un:" point",h:"+ 3 - 3 + 1",w:"Cavalier contre fou, puis un pion gratuit : + 1."},
{i:"e289_12",u:289,t:"story",d:.4,q:"Que dis-tu à Baptiste ?",ctx:"Baptiste veut prendre un pion en e5 avec son cavalier. Le pion est défendu par un pion d6 et par un cavalier c6. Il attaque e5 avec un cavalier et une dame.",sc:[{who:"Baptiste",txt:"Deux attaquants, deux défenseurs, je prends ?"}],o:["Non : il reprend avec d6, tu perds 2","Oui, tu as plus d'attaquants que lui","Oui, avec ta dame en premier","Non, un cavalier ne prend jamais"],a:0,w:"Cxe5 dxe5 : cavalier 3 contre pion 1, - 2. Et Dxe5 Cxe5 serait pire."},
{i:"e289_13",u:289,t:"slider",d:.45,q:"Une case est attaquée par 3 de tes pièces et défendue par 2. Combien d'attaquants as-tu en plus ?",min:0,max:5,step:1,a:1,tol:0,pre:"",un:" de plus",w:"3 - 2 = 1 attaquant de plus : la prise est souvent gagnante, si tu commences par la pièce la moins chère."},
{i:"e289_14",u:289,t:"multi",d:.45,q:"Quelles questions poses-tu avant de prendre une pièce ?",o:["Qui la défend ?","Qui l'attaque ?","L'échange me profite-t-il en valeur ?","Quelle est la couleur de sa case ?"],a:[0,1,2],w:"Règle d'or de ta formation : compte avant chaque échange."},
{i:"e289_15",u:289,t:"fill",d:.45,nw:"Les pièces qui traînent",q:"Une pièce protégée par rien est une pièce non ___.",o:["défendue","clouée","promue","protégeable"],a:0,w:"Les pièces qui traînent finissent par tomber : protège-les."},
{i:"e289_16",u:289,t:"tf",d:.5,q:"Une pièce non défendue est une cible idéale pour une fourchette.",a:true,w:"Une fourchette sur deux pièces non défendues gagne forcément l'une d'elles."},
{i:"e289_17",u:289,t:"story",d:.5,q:"Rappel du module 7 : que dis-tu ?",ctx:"Ton fou b5 et ta tour e5 ne sont défendus par rien. Un cavalier noir peut sauter en d6.",sc:[{who:"Léna",txt:"Il peut aller en d6. Et alors ?"}],o:["De d6, il attaque b5 et e4, pas e5","De d6, il fourchette b5 et e5 d'un coup","Rien, un cavalier ne va jamais en d6","Il met ton roi en échec en d6"],a:0,w:"De d6, un cavalier attaque b5, b7, c4, c8, e4, e8, f5, f7. Pas e5. Toujours vérifier les cases réelles, sans paniquer."},
{i:"e289_18",u:289,t:"slider",d:.5,nw:"La cadence",q:"Selon ta formation, combien de minutes minimum par joueur pour s'entraîner ?",min:1,max:30,step:1,a:10,tol:0,pre:"",un:" min",w:"10+0 minimum, idéalement 15+10, tant que les bases ne sont pas automatiques."},
{i:"e289_19",u:289,t:"mcq",d:.55,q:"Que signifie la cadence « 15+10 » ?",o:["15 min par joueur, + 10 s par coup joué","15 coups en 10 minutes","15 s par coup, 10 min au total","15 min pour les deux joueurs réunis"],a:0,w:"Le chiffre après le + est l'incrément : les secondes ajoutées à chaque coup joué."},
{i:"e289_20",u:289,t:"sort",d:.55,q:"Adaptée ou non pour apprendre les bases ?",bins:["Adaptée","Pas adaptée"],it:[["15+10",0],["1+0 (bullet)",1],["10+0",0],["3+0 (blitz)",1],["30+0",0]],w:"Il faut le temps de faire É.P.M. à chaque coup : au moins 10 minutes."},
{i:"e289_21",u:289,t:"story",d:.55,q:"Que dis-tu à Baptiste ?",sc:[{who:"Baptiste",txt:"Je joue 50 parties de 1 minute par jour dans le métro. Je devrais progresser vite."}],o:["Moins de parties, plus longues, analysées","Oui, le volume fait tout, continue ainsi","Oui, et passe même à 30 secondes","Non, arrête complètement les échecs"],a:0,w:"En bullet, tu répètes tes gaffes sans les voir. Cadence longue et analyse de la partie perdue."},
{i:"e289_22",u:289,t:"tiles",d:.6,q:"Reconstitue ce que Viktor dit à Baptiste après sa semaine de carnet.",a:["Tu","as","arrêté","de","donner","tes","pièces"],dd:["appris","ouvertures"],w:"Sous 1500 Elo, ne plus gaffer suffit à gagner beaucoup de parties."},
{i:"e289_23",u:289,t:"tf",d:.6,q:"Selon ta formation, la routine É.P.M. élimine la grande majorité des erreurs de débutant.",a:true,w:"Mécanique et lente au début, elle devient un réflexe."},
{i:"e289_24",u:289,t:"num",d:.6,q:"Partie en 15+10 qui dure 40 coups. Combien de secondes d'incrément un joueur a-t-il reçues au total ?",a:400,tol:0,un:" s",h:"40 x 10",w:"400 secondes, soit plus de 6 minutes en plus des 15 de départ."},
{i:"e289_25",u:289,t:"story",d:.65,q:"Rappel du module 4 : que dis-tu ?",sc:[{who:"Léna",txt:"Je peux prendre sa tour (5) avec mon fou (3), mais il reprend avec un pion. Bonne affaire ?"}],o:["Oui : + 2 points","Non : - 2 points","Égalité parfaite","Non : - 5 points"],a:0,w:"5 - 3 = + 2. On appelle ça gagner la qualité : une tour contre une pièce mineure."},
{i:"e289_26",u:289,t:"match",d:.65,q:"Associe chaque cadence à son nom.",p:[["1 minute","Bullet"],["3 à 5 minutes","Blitz"],["10 à 60 minutes","Rapide"],["Plus d'une heure","Partie longue"]],w:"Ordres de grandeur utilisés par la FIDE et les sites en ligne."},
{i:"e289_27",u:289,t:"multi",d:.7,q:"Après ton coup prévu, que vérifies-tu ?",o:["La case d'arrivée est-elle attaquée ?","Ai-je laissé une pièce non défendue ?","Ai-je ouvert une ligne vers mon roi ?","Ai-je bien joué vite ?"],a:[0,1,2],w:"La vérification de ton propre coup : É.P.M. vu depuis l'adversaire."},
{i:"e289_28",u:289,t:"tf",d:.7,q:"Selon ta formation, il faut abandonner une partie dès qu'on a perdu une pièce.",a:false,w:"Au contraire : termine toujours tes parties plutôt que de les abandonner par dépit."},
{i:"e289_29",u:289,t:"order",d:.7,q:"Remets dans l'ordre ta réflexion à chaque coup.",it:["Regarder le dernier coup adverse et sa menace","Chercher mes échecs et mes prises","Choisir un coup candidat","Vérifier ce qu'il pourra faire après","Jouer le coup"],w:"Menaces d'abord, puis tes options, puis la vérification anti-gaffe."},
{i:"e289_30",u:289,t:"story",d:.75,q:"Que dit Viktor ?",sc:[{who:"Baptiste",txt:"Ta formation dit que É.P.M. fait gagner presque toutes les parties. C'est prouvé ?"}],o:["Un avis de coachs, pas une statistique","Oui, c'est prouvé officiellement par la FIDE","Oui, 100 % des parties sont alors gagnées","Non, ça ne sert à rien du tout en partie"],a:0,w:"Formulation exagérée de la formation. Ce qui est sûr : elle supprime la plupart des gaffes."},
{i:"e289_31",u:289,t:"mcq",d:.75,q:"Quel est le premier réflexe quand l'adversaire vient de jouer ?",o:["Chercher ce qu'il menace","Jouer mon coup préparé","Regarder vite la pendule","Lui proposer la nulle"],a:0,w:"M comme Menaces : son dernier coup cache souvent une attaque."},
{i:"e289_32",u:289,t:"story",d:.75,q:"Synthèse : que dit Viktor ?",sc:[{who:"Viktor Sokolov",txt:"Résume-moi ta semaine de carnet en une phrase."}],o:["Trois questions, chaque coup, cadence longue","Une nouvelle ouverture par jour de la semaine","Des parties de 1 minute pour aller plus vite","Des pièges d'ouverture tendus à chaque partie"],a:0,w:"É.P.M., compter les échanges, 15+10 : la routine qui fait monter l'Elo."}
