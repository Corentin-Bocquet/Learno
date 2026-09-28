/*UNIT*/
{id:276,c:"FOOT",n:"Module 12",t:"Les statistiques : xG, possession et pièges des chiffres",col:"--green",ic:"📊",guide:`
<h3>Ce que tu dois savoir faire</h3>
<ul><li>Définir et lire les <b>expected goals</b> (xG).</li>
<li>Expliquer pourquoi la <b>possession</b> peut tromper.</li>
<li>Utiliser <b>tirs</b>, <b>tirs cadrés</b>, <b>PPDA</b> et <b>field tilt</b> ensemble.</li>
<li>Dire si un résultat est <b>logique</b> ou <b>chanceux</b>.</li></ul>
<h3>Le 1-0 qui ne veut rien dire</h3>
<div class="gstory">Racing 1, Scarpe 0. Mehdi exulte : « 65 % de possession, 18 tirs, on les a écrasés ! » Élodie ouvre son tableau : xG du Racing 0,7, xG du Scarpe 2,1. « Ils ont eu trois énormes occasions, nous presque aucune. On a gagné, tant mieux. Mais si on rejoue ce match dix fois, on le perd souvent. » Mehdi fait la tête. Samir, lui, prend des notes.</div>
<h3>Les expected goals (xG)</h3>
<ul><li>Chaque tir reçoit une <b>probabilité d'être marqué</b>, entre 0 et 1, calculée sur des milliers de tirs semblables.</li>
<li>On tient compte de la <b>distance</b>, de l'<b>angle</b>, de la <b>partie du corps</b>, du type de passe et de la <b>pression</b> défensive.</li>
<li>En additionnant les xG d'un match, on mesure la <b>qualité</b> des occasions, pas leur nombre.</li>
<li>Repères : un penalty vaut environ <b>0,76 à 0,79</b> xG selon les modèles, une frappe lointaine souvent moins de <b>0,05</b>.</li></ul>
<div class="formula">Racing : 18 tirs, dont 15 de loin à 0,03 et 3 à 0,08 : 0,45 + 0,24 = 0,69 xG
Scarpe : 5 tirs, dont 3 face au but à 0,6 et 2 à 0,15 : 1,8 + 0,3 = 2,1 xG</div>
<div class="gmnemo"><b>« Les tirs comptent, les xG pèsent »</b>. Dix-huit frappes de loin pèsent moins que trois face-à-face.</div>
<h3>La possession, une statistique trompeuse</h3>
<ul><li>La <b>possession</b> dit qui a eu le ballon, pas ce qu'il en a fait.</li>
<li>Une équipe en <b>bloc bas</b> laisse volontairement le ballon pour contrer (module 6).</li>
<li>65 % de possession avec des passes latérales loin du but ne crée rien.</li></ul>
<h3>Les autres chiffres</h3>
<table><tr><th>Statistique</th><th>Ce qu'elle mesure</th></tr>
<tr><td><b>Tirs</b></td><td>Le volume, sans la qualité</td></tr>
<tr><td><b>Tirs cadrés</b></td><td>Les tirs qui obligent le gardien à intervenir ou qui marquent</td></tr>
<tr><td><b>PPDA</b></td><td>L'intensité du pressing (module 7) : bas = pressing fort</td></tr>
<tr><td><b>Field tilt</b></td><td>La part des ballons touchés dans le <b>dernier tiers</b> par chaque équipe : qui joue près du but adverse</td></tr>
<tr><td><b>Différence de xG</b></td><td>xG créés moins xG concédés : la domination réelle</td></tr></table>
<h3>Lire un résultat</h3>
<ul><li>Si le vainqueur a <b>plus de xG</b> : victoire logique.</li>
<li>S'il a <b>beaucoup moins</b> de xG : victoire chanceuse, ou gardien exceptionnel, ou finition hors norme.</li>
<li>Sur <b>un seul match</b>, le hasard pèse lourd. Sur <b>dix matchs</b>, les xG deviennent un bon indicateur du niveau.</li></ul>
<div class="gmnemo"><b>« Un match raconte une histoire, dix matchs racontent la vérité »</b>. Ne juge jamais une équipe sur un seul chiffre d'un seul match.</div>
<div class="gtrap">Ta fiche n'aborde pas les statistiques. Elles complètent l'œil : l'observation dit <b>pourquoi</b>, les chiffres disent <b>combien</b>. Mais aucun chiffre ne remplace la grille d'observation, et une seule statistique isolée trompe presque toujours.</div>
<h3>Ce que tu dois retenir</h3>
<ul><li>xG : probabilité de marquer, la qualité des occasions.</li>
<li>Possession : qui a le ballon, pas qui domine.</li>
<li>Tirs cadrés, PPDA, field tilt, différence de xG.</li>
<li>Un match raconte une histoire, dix matchs racontent la vérité.</li></ul>`},
/*EXOS*/
{i:"k276_01",u:276,t:"mcq",d:.2,nw:"Les expected goals",q:"Que mesurent les expected goals (xG) ?",o:["La qualité des occasions","Le nombre de passes réussies","La distance parcourue","Le temps de possession"],a:0,w:"Chaque tir reçoit une probabilité d'être marqué : on mesure la qualité, pas le nombre."},
{i:"k276_02",u:276,t:"story",d:.25,q:"Que réponds-tu à Mehdi ?",sc:[{who:"Mehdi",txt:"65 % de possession, 18 tirs : on les a écrasés !"}],o:["0,7 xG contre 2,1 : ils ont eu les vraies occasions","Oui, 18 tirs prouvent une domination totale du Racing","Oui, la possession décide toujours du match","Non, parce que nous avons moins de corners"],a:0,w:"Les tirs comptent, les xG pèsent. Dix-huit frappes de loin pèsent peu."},
{i:"k276_03",u:276,t:"multi",d:.3,q:"Qu'est-ce qui entre dans le calcul des xG d'un tir ?",o:["La distance","L'angle","La partie du corps","La couleur du maillot","Le score du match précédent"],a:[0,1,2],w:"Distance, angle, partie du corps, type de passe, pression défensive."},
{i:"k276_04",u:276,t:"slider",d:.3,q:"Environ combien de xG vaut un penalty ?",min:0,max:1,step:.01,a:.77,tol:.03,pre:"",un:" xG",w:"Environ 0,76 à 0,79 selon les modèles : un peu plus de trois penalties sur quatre sont marqués."},
{i:"k276_05",u:276,t:"tf",d:.3,q:"Une frappe de 35 mètres a en général un xG très faible.",a:true,w:"Souvent moins de 0,05 : la distance réduit fortement les chances."},
{i:"k276_06",u:276,t:"tiles",d:.3,q:"Reconstitue la formule mémo des xG.",a:["Les","tirs","comptent,","les","xG","pèsent"],dd:["passes","courent,","corners"],w:"Le nombre de tirs ne dit rien de leur qualité."},
{i:"k276_07",u:276,t:"num",d:.35,q:"Le Racing tire 15 fois de loin à 0,03 xG chacun. Total de xG sur ces tirs ?",a:.45,tol:.001,un:" xG",h:"15 x 0,03",w:"15 x 0,03 = 0,45 xG : quinze tirs valent moins qu'un demi-but."},
{i:"k276_08",u:276,t:"num",d:.4,q:"Le Scarpe a 3 face-à-face à 0,6 xG et 2 tirs à 0,15. Total de ses xG ?",a:2.1,tol:.001,un:" xG",h:"1,8 + 0,3",w:"3 x 0,6 + 2 x 0,15 = 2,1 xG : cinq tirs valent deux buts attendus."},
{i:"k276_09",u:276,t:"sort",d:.4,q:"xG élevé ou faible ?",bins:["xG élevé","xG faible"],it:[["Tir à 6 mètres face au but vide",0],["Frappe de 35 mètres",1],["Penalty",0],["Tête décentrée à l'angle de la surface",1],["Face-à-face avec le gardien à 10 mètres",0]],w:"Plus c'est près, face au but et sans pression, plus l'xG monte."},
{i:"k276_10",u:276,t:"story",d:.4,nw:"La possession trompeuse",q:"Que réponds-tu à Samir ?",sc:[{who:"Samir Benhaddou",txt:"Le Scarpe a eu 35 % de possession. Ils ont subi tout le match, non ?"}],o:["Pas forcément : leur bloc bas nous a laissé le ballon","Oui, moins de 40 % de possession prouve toujours qu'on subit","Oui, ils n'ont pas eu d'occasion avec si peu","Non, ils ont eu plus de corners que nous"],a:0,w:"La possession dit qui a le ballon, pas qui domine. Un bloc bas laisse le ballon pour contrer."},
{i:"k276_11",u:276,t:"tf",d:.4,q:"Une équipe avec 70 % de possession domine toujours le match.",a:false,w:"Si ses passes sont latérales et loin du but, elle ne crée rien. La possession se lit avec les xG."},
{i:"k276_12",u:276,t:"fill",d:.4,q:"La possession dit qui a eu le ballon, pas ce qu'il en a ___.",o:["fait","perdu","gardé","payé"],a:0,w:"Il faut regarder où et comment le ballon a été utilisé."},
{i:"k276_13",u:276,t:"match",d:.45,nw:"Les autres statistiques",q:"Associe chaque statistique à ce qu'elle mesure.",p:[["Tirs cadrés","Tirs qui obligent le gardien à agir"],["PPDA","Intensité du pressing"],["Field tilt","Part des ballons dans le dernier tiers"],["Différence de xG","Domination réelle"]],w:"Chaque chiffre éclaire un angle. Aucun ne suffit seul."},
{i:"k276_14",u:276,t:"mcq",d:.45,q:"Que mesure le field tilt ?",o:["La part des touches dans le dernier tiers","La pente du terrain du stade","Le nombre de fautes commises par chaque équipe","La vitesse moyenne des joueurs"],a:0,w:"Qui joue près du but adverse : c'est la domination territoriale."},
{i:"k276_15",u:276,t:"num",d:.45,q:"Le Racing crée 1,8 xG et concède 0,9 xG. Quelle est sa différence de xG ?",a:.9,tol:.001,un:" xG",h:"créés moins concédés",w:"1,8 - 0,9 = + 0,9 : le Racing a créé deux fois plus qu'il n'a concédé."},
{i:"k276_16",u:276,t:"sort",d:.45,q:"Ce chiffre mesure-t-il le volume ou la qualité ?",bins:["Volume","Qualité"],it:[["Nombre de tirs",0],["xG",1],["Nombre de passes",0],["Différence de xG",1]],w:"Compter ne suffit pas : les xG mesurent la qualité."},
{i:"k276_17",u:276,t:"story",d:.5,nw:"Lire un résultat",q:"Que dis-tu à Samir ?",ctx:"Le Racing gagne 1-0 avec 0,7 xG contre 2,1 xG pour le Scarpe. Tom a fait trois arrêts décisifs.",sc:[{who:"Samir Benhaddou",txt:"Victoire méritée ?"}],o:["Chanceuse, grâce à Tom : il faut corriger la défense","Méritée, puisque nous avons eu 65 % de possession du ballon","Méritée, un 1-0 est toujours logique","Chanceuse, car l'arbitre nous a aidés"],a:0,w:"Beaucoup moins de xG : victoire chanceuse, ou gardien exceptionnel. Le problème défensif reste à corriger."},
{i:"k276_18",u:276,t:"tf",d:.5,q:"Sur un seul match, le hasard pèse lourd dans le résultat.",a:true,w:"Un match raconte une histoire, dix matchs racontent la vérité."},
{i:"k276_19",u:276,t:"tiles",d:.5,q:"Reconstitue la phrase mémo sur les échantillons.",a:["Un","match","raconte","une","histoire,","dix","matchs","racontent","la","vérité"],dd:["mensonge,","cent"],w:"Juger une équipe sur un seul match, c'est confondre hasard et niveau."},
{i:"k276_20",u:276,t:"multi",d:.5,q:"Qu'est-ce qui peut expliquer une victoire avec bien moins de xG ?",o:["Un gardien exceptionnel","Une finition hors norme","De la chance","Plus de possession","Plus de corners"],a:[0,1,2],w:"Gardien, finition, chance. La possession et les corners n'expliquent pas l'écart de qualité des occasions."},
{i:"k276_21",u:276,t:"mcq",d:.5,q:"Rappel du module 7 : un PPDA de 7 signifie…",o:["Un pressing très intense","Un bloc très bas","Une possession de 70 %","Sept buts marqués"],a:0,w:"Peu de passes laissées avant une action défensive : pression forte."},
{i:"k276_22",u:276,t:"story",d:.55,q:"Que réponds-tu à Mehdi ?",sc:[{who:"Mehdi",txt:"Sur dix matchs, on a 14 xG créés et 17 xG concédés, mais on est deuxièmes. On va être champions !"}],o:["Prudence : notre différence de xG est négative","Oui, le classement ne ment jamais","Oui, les xG ne servent à rien sur dix matchs","Non, parce qu'on a trop de possession"],a:0,w:"Sur dix matchs, les xG deviennent un bon indicateur : - 3 annonce une possible baisse des résultats."},
{i:"k276_23",u:276,t:"fill",d:.55,q:"La différence de xG se calcule : xG créés moins xG ___.",o:["concédés","cadrés","ratés","annulés"],a:0,w:"Créés moins concédés : la domination réelle sur les occasions."},
{i:"k276_24",u:276,t:"order",d:.55,q:"Remets dans l'ordre la lecture statistique d'un match.",it:["Regarder le score","Comparer les xG","Vérifier tirs cadrés et field tilt","Relier aux observations de la grille","Conclure : logique ou chanceux"],w:"Score, qualité, contexte, observation, conclusion."},
{i:"k276_25",u:276,t:"story",d:.55,q:"Rappel du module 6 : que dis-tu ?",ctx:"Le Scarpe a 30 % de possession, un PPDA de 18 et 1,9 xG sur contre-attaques.",sc:[{who:"Élodie Marchal",txt:"Décris leur plan en une phrase."}],o:["Bloc bas attentiste, dangereux en transition","Pressing très haut et agressif sur toute la largeur","Possession longue et patiente","Aucun plan, ils ont subi"],a:0,w:"Peu de possession, PPDA élevé, xG en contre : le plan d'un bloc bas qui frappe en transition."},
{i:"k276_26",u:276,t:"tf",d:.55,q:"Une seule statistique isolée suffit à juger un match.",a:false,w:"Aucune ne suffit seule. Les chiffres disent combien, l'observation dit pourquoi."},
{i:"k276_27",u:276,t:"match",d:.6,q:"Associe chaque profil statistique à l'équipe qui correspond.",p:[["65 % de possession, 0,7 xG","Possession stérile"],["30 % de possession, 1,9 xG","Contre-attaque efficace"],["PPDA de 7, field tilt de 70 %","Domination territoriale et pressing"],["xG faible des deux côtés","Match fermé"]],w:"Croiser les chiffres pour trouver le plan de jeu."},
{i:"k276_28",u:276,t:"mcq",d:.6,q:"Pourquoi l'analyste relie-t-il les chiffres à la grille d'observation ?",o:["Les chiffres disent combien, l'œil dit pourquoi","Les chiffres remplacent entièrement l'observation du match","L'observation remplace les chiffres","Pour faire plaisir aux supporters"],a:0,w:"Les deux se complètent : aucun chiffre ne dit pourquoi une occasion est née."},
{i:"k276_29",u:276,t:"num",d:.6,q:"Un attaquant tire 4 penalties à 0,78 xG chacun. Combien de buts attendus ?",a:3.12,tol:.01,un:" xG",h:"4 x 0,78",w:"4 x 0,78 = 3,12 : on attend environ trois buts sur quatre penalties."},
{i:"k276_30",u:276,t:"sort",d:.6,q:"Victoire logique ou chanceuse ?",bins:["Logique","Chanceuse"],it:[["Gagne 2-0 avec 2,5 xG contre 0,4",0],["Gagne 1-0 avec 0,3 xG contre 2,2",1],["Gagne 3-1 avec 2,8 xG contre 1,1",0],["Gagne 2-1 avec 0,6 xG contre 2,4",1]],w:"Plus de xG que l'adversaire : logique. Beaucoup moins : chanceuse."},
{i:"k276_31",u:276,t:"tf",d:.6,q:"Sur dix matchs, la différence de xG ne dit rien du niveau d'une équipe.",a:false,w:"Faux : sur dix matchs, le hasard s'efface et la différence de xG devient un bon indicateur du niveau."},
{i:"k276_32",u:276,t:"story",d:.6,q:"Synthèse : Élodie te demande ton bilan chiffré du match.",sc:[{who:"Élodie Marchal",txt:"Une phrase pour Samir."}],o:["« Victoire chanceuse : 0,7 xG contre 2,1, sauvés par Tom »","« Domination totale : 65 % de possession et 18 tirs »","« Match nul logique, les deux équipes se valent »","« Défaite injuste, l'arbitre nous a volés »"],a:0,w:"Les xG disent la qualité des occasions : le score ne dit pas tout."}
