/*EXAMEN*/
{
cases:[
{id:"pieces",t:"Le cube du grenier : centres, arêtes, coins",mods:[293],
 ctx:"Samedi après-midi, médiathèque de Tourcoing. Thierry pose son cube jauni de 1981 : il fait une face, jamais deux. Inès, qui anime le club, lui donne un cube neuf et lui demande de le garder en main pendant tout le cours.",
 cards:[
 {t:"match",q:"Associe chaque sorte de pièce à son nombre.",p:[["Centres","6, une seule couleur, ne changent jamais de place"],["Arêtes","12, deux couleurs"],["Coins","8, trois couleurs"]],w:"« 6, 12, 8 » comme un code de cadenas. Au total, 26 pièces visibles et 54 autocollants (6 faces de 9 cases)."},
 {t:"sort",q:"Peut-on trouver cette pièce sur un cube standard ?",bins:["Existe","N'existe pas"],it:[["Une arête blanche et jaune",1],["Une arête rouge et verte",0],["Un coin bleu, rouge et blanc",0],["Une arête rouge et orange",1],["Un coin bleu, vert et jaune",1]],w:"Les couleurs opposées ne se touchent jamais sur une même pièce : blanc et jaune, rouge et orange, bleu et vert."},
 {t:"story",q:"Que réponds-tu à Thierry ?",sc:[{who:"Thierry",txt:"Je fais une face, puis la suivante. Pourquoi je n'arrive jamais à finir ?"}],
  o:["Tu casses tout : on résout des pièces, couche par couche","Tu fais la mauvaise face : il faut commencer par la face jaune ici","Ton cube de 1981 est trop vieux : il est impossible à finir","Tu tournes trop vite : il suffit de ralentir pour réussir"],a:0,w:"Piège numéro un. Une face finie au mauvais endroit oblige à tout défaire. Ce qui compte : la première couche, alignée avec les centres."},
 {t:"num",q:"Un cube a 6 faces de 9 cases. Combien d'autocollants au total ?",a:54,tol:0.1,w:"6 x 9 = 54 autocollants. Les 26 pièces visibles sont 6 centres, 12 arêtes et 8 coins."},
 {t:"tf",q:"Toute position du cube 3x3 se résout en 20 mouvements au maximum : c'est le nombre de Dieu, démontré en 2010.",a:true,w:"Vrai. Le cube a environ 43 milliards de milliards de positions possibles. Inventé en 1974 par Ernő Rubik, à Budapest."}
 ]},
{id:"notation",t:"Le carnet de Sacha : lire R U R' U' sans regarder",mods:[294],
 ctx:"Sacha ouvre un carnet couvert de lettres : R U R' U', F R U R' U' F'. Thierry pense au chinois. Sacha explique que six lettres et deux signes suffisent à lire n'importe quelle solution. Inès ajoute la règle d'or : le cube ne tourne jamais dans tes mains pendant une séquence.",
 cards:[
 {t:"match",q:"Associe chaque lettre à sa face.",p:[["R","Droite (Right)"],["L","Gauche (Left)"],["U","Dessus (Up)"],["D","Dessous (Down)"],["F","Devant (Front)"],["B","Derrière (Back)"]],w:"Une lettre seule : sens des aiguilles d'une montre, vu depuis cette face."},
 {t:"num",q:"Tu fais six fois de suite R U R' U'. Combien de quarts de tour as-tu faits au total ?",a:24,tol:0.1,w:"4 mouvements x 6 = 24 quarts de tour. Et le cube revient à l'état de départ. C'est le « sexy move », que tu vas utiliser des centaines de fois."},
 {t:"tiles",q:"Reconstitue l'inverse exact de F R U R' U' F' (les mouvements en sens inverse, dans l'ordre inverse).",a:["F","U","R","U'","R'","F'"],dd:["F'","U2","R2"],w:"Pour défaire une séquence, on la fait à l'envers : le dernier mouvement d'abord, chacun dans le sens inverse. F' devient F, U' devient U, R' devient R, puis U' et R', F'."},
 {t:"story",q:"Que réponds-tu à Thierry ?",sc:[{who:"Thierry",txt:"Que veut dire R2 ? Je tourne la face droite deux fois dans le même sens, ou dans les deux sens ?"}],
  o:["Un demi-tour : deux quarts de tour, peu importe le sens","Un quart de tour, mais dans le sens inverse des aiguilles","Deux quarts de tour, l'un après l'autre dans des sens opposés","Un tour complet de la face, soit quatre quarts de tour"],a:0,w:"R2 : un demi-tour. R puis R' : rien n'a bougé. R2 puis R2 : rien n'a bougé non plus."},
 {t:"tf",q:"Pendant une séquence, on peut tourner tout le cube dans ses mains pour trouver la bonne face.",a:false,w:"Faux : la face de devant change, et toute la suite part de travers. Pendant une séquence, tes mains gardent le cube immobile, seules les faces tournent. Les rotations x, y, z existent, mais on les note."}
 ]},
{id:"croix",t:"Première victoire : la marguerite puis la croix blanche",mods:[295],
 ctx:"Inès mélange le cube de Thierry et lui demande de faire une fleur : un centre jaune, et autour quatre pétales blancs. Elle lui montre qu'aucune formule n'est nécessaire. Vingt minutes plus tard, Thierry pose le cube, blanc en dessous : sa première croix blanche.",
 cards:[
 {t:"order",q:"Remets dans l'ordre le plan de l'étape 1.",it:["Monter les 4 arêtes blanches autour du centre jaune (marguerite)","Tourner U pour aligner un pétale sur son centre de côté","Faire un demi-tour de cette face","Retourner le cube : croix blanche et petits T"],w:"« Fleur, T, demi-tour. » La fleur se cueille en haut, puis chaque pétale est planté en bas, à côté de la bonne couleur."},
 {t:"sort",q:"Que fais-tu selon l'emplacement de l'arête blanche ?",bins:["Demi-tour de la face","Un quart de tour puis cas du milieu","Tourner la face sans blanc"],it:[["Couche du bas, blanc en dessous",0],["Couche du bas, blanc sur le côté",1],["Couche du milieu",2],["Couche du haut, blanc sur le côté",1]],w:"Avant de monter une pièce, tourne U pour libérer la place au-dessus d'elle."},
 {t:"story",q:"Que dis-tu à Thierry, qui tourne en rond ?",sc:[{who:"Thierry",txt:"Chaque fois que je monte une arête, un pétale déjà posé disparaît. Pourquoi ?"}],
  o:["Tu montes sur un pétale : libère la place avec U","Tu tournes la mauvaise face : il faut toujours utiliser B","Tes pétales sont mal alignés : il faut refaire la croix en dessous","Tu manques de vitesse : tourne plus vite pour ne pas les éjecter"],a:0,w:"Le piège de la marguerite : monter une arête là où un pétale est déjà. Il est éjecté."},
 {t:"num",q:"Toute croix se fait en 8 mouvements au maximum. Un débutant met 40 secondes pour 8 mouvements. Combien de secondes par mouvement en moyenne ?",a:5,tol:0.1,un:" s",w:"40 / 8 = 5 secondes. Objectif débutant : une croix en moins d'une minute, puis en moins de 20 secondes."},
 {t:"tf",q:"Une croix juste a, sur chaque côté, un T d'une couleur différente de celle du centre.",a:false,w:"Faux : le T est de la même couleur que le centre : le pétale est au-dessus de son centre de côté, puis un demi-tour le fait descendre, blanc en dessous."}
 ]},
{id:"coins",t:"La machine à laver : les coins blancs",mods:[296],
 ctx:"Thierry a sa croix. Il tient un coin blanc, rouge et vert. Sacha lui dit de le mettre en haut, juste au-dessus de sa place, devant à droite, puis de lancer la machine à laver : R U R' U' répété jusqu'à ce que ce soit propre.",
 cards:[
 {t:"match",q:"Associe l'orientation du blanc au nombre de R U R' U'.",p:[["Le blanc regarde à droite","1 fois"],["Le blanc regarde vers le haut","3 fois"],["Le blanc regarde devant toi","5 fois"]],w:"« Droite 1, haut 3, devant 5 ». Ou rien à retenir : tu répètes jusqu'à ce que ce soit propre."},
 {t:"num",q:"Un coin a son blanc devant toi. Combien de mouvements fais-tu en tout (5 fois R U R' U') ?",a:20,tol:0.1,w:"5 x 4 = 20 mouvements. Pendant la machine à laver, tu ne fais que R U R' U', rien d'autre."},
 {t:"story",q:"Que dis-tu à Thierry, inquiet au milieu de la série ?",sc:[{who:"Thierry",txt:"Au milieu de la série, ma croix est cassée ! Je tourne U pour réparer ?"}],
  o:["Non : continue R U R' U', la croix se reforme à la fin","Oui : un U rapide remet le coin bien en place avant la suite","Non : arrête, démonte le coin et remonte-le à la main","Oui : retourne le cube pour vérifier avant de continuer"],a:0,w:"Tourner U pendant la répétition fait quitter au coin sa place. La croix semble cassée, c'est normal : elle se reforme à la fin."},
 {t:"order",q:"Remets dans l'ordre le geste pour un coin blanc.",it:["Chercher un coin blanc dans la couche du haut","Tourner U pour l'amener au-dessus de sa place","Tourner le cube (y) pour avoir la place devant à droite","R U R' U' jusqu'à ce que le coin soit posé"],w:"Le coin se gare au-dessus de sa place, devant à droite."},
 {t:"tf",q:"Un coin blanc coincé en bas à la mauvaise place se sort avec un R U R' U', une fois, depuis devant à droite.",a:true,w:"Vrai : il remonte en haut, puis on le traite comme un coin normal."}
 ]},
{id:"couche2",t:"Le T qui hésite : la deuxième couche",mods:[297],
 ctx:"Thierry a sa première couche. Il regarde le haut du cube, perdu. Inès pointe une arête verte et orange en haut, devant : le vert est au-dessus du centre vert, et l'orange est au-dessus. L'orange est à droite : l'arête veut aller à droite.",
 cards:[
 {t:"story",q:"Quelle séquence fais-tu pour envoyer l'arête à droite ?",sc:[{who:"Inès",txt:"Le T vertical est formé devant. La couleur du dessus est celle de droite. Que fais-tu ?"}],
  o:["U R U' R' U' F' U F","U' L' U L U F U' F'","R U R' U' R' F R F'","F R U R' U' F'"],a:0,w:"Droite : U R U' R' U' F' U F. Gauche : son miroir. « Éloigne, lave à droite, ramène, lave devant. »"},
 {t:"sort",q:"Droite ou gauche ? (T vertical devant, regarde la couleur du dessus)",bins:["Va à droite","Va à gauche"],it:[["Dessus orange, orange est à droite",0],["Dessus rouge, rouge est à gauche",1],["Dessus du côté de la face de droite",0],["Dessus du côté de la face de gauche",1]],w:"C'est la couleur du dessus de l'arête qui indique la direction, pas celle de devant."},
 {t:"tiles",q:"Reconstitue la séquence vers la droite.",a:["U","R","U'","R'","U'","F'","U","F"],dd:["L'","R2","F2"],w:"U R U' R' U' F' U F : huit mouvements, un sexy move à droite et un à devant. Apprends-en une : l'autre est son miroir."},
 {t:"multi",q:"Coche tout ce qui est vrai pour l'étape 3.",o:["Une arête avec du jaune n'a rien à faire dans la deuxième couche","On forme un T vertical devant avant de lancer la séquence","La première couche ne doit pas avoir bougé à la fin","Une arête coincée se sort avec la séquence et une arête jaune","On lance la séquence sans T vertical pour gagner du temps"],a:[0,1,2,3],w:"Lancer sans T vertical envoie l'arête au mauvais endroit et casse une arête déjà posée."},
 {t:"tf",q:"Le miroir de la séquence droite remplace chaque R par L et change le sens de chaque U.",a:true,w:"Vrai : gauche = U' L' U L U F U' F'. Mêmes gestes, version miroir."}
 ]},
{id:"croixjaune",t:"L'horloge de Thierry : point, L, ligne, croix",mods:[298],
 ctx:"Deux couches finies. Thierry regarde le dessus jaune : un L, deux arêtes jaunes qui forment un angle. Il lance F R U R' U' F' et obtient un autre L. Sacha rigole : son L est à 3 heures et midi, il doit être à 9 heures et midi.",
 cards:[
 {t:"match",q:"Associe chaque dessin au nombre de formules.",p:[["Croix","0, déjà faite"],["Ligne horizontale","1 formule"],["L à 9 h et midi","2 formules"],["Point","3 formules"]],w:"La formule fait avancer le dessin d'un cran : point, L, ligne, croix."},
 {t:"num",q:"Tu as un point au départ. Chaque formule F R U R' U' F' fait 6 mouvements. Combien de mouvements pour arriver à la croix (3 formules) ?",a:18,tol:0.1,w:"3 x 6 = 18 mouvements. Point, L, ligne, croix : 3 formules."},
 {t:"story",q:"Que dis-tu à Thierry, dont le L ne donne rien ?",sc:[{who:"Thierry",txt:"Mon L devient un autre L à chaque fois. Qu'est-ce que je fais de travers ?"}],
  o:["Tourne U pour mettre le L à 9 h et midi avant la formule","Tourne le cube entier pour le mettre à l'envers","Utilise la formule du Sune à la place de la formule en F","Recommence la croix blanche : elle est sûrement fausse"],a:0,w:"Avant chaque formule, vérifie l'horloge (L à 9 h et midi) ou l'horizon (ligne horizontale)."},
 {t:"sort",q:"Comment tenir le dessin avant la formule ?",bins:["Ligne","L","Point"],it:[["Horizontale, de gauche à droite",0],["Branches à gauche et derrière",1],["N'importe comment",2]],w:"Ligne tenue à la verticale : la formule renvoie alors un point."},
 {t:"tf",q:"On peut voir une seule arête jaune vers le haut, ou trois arêtes, à l'étape 4.",a:false,w:"Faux : le nombre d'arêtes jaunes vers le haut est toujours pair : 0, 2 ou 4. Si ce n'est pas le cas, le cube a été démonté et mal remonté."}
 ]},
{id:"sune",t:"Le soleil de Sacha : placer les arêtes jaunes",mods:[299],
 ctx:"Thierry a sa croix jaune, mais sur les côtés rien ne colle : l'arête rouge est au-dessus du centre vert. Sacha lui dit de tourner le dessus jusqu'à ce que deux arêtes collent à leur centre. Rouge sur rouge, bleu sur bleu : elles sont voisines.",
 cards:[
 {t:"story",q:"Où tiens-tu les deux arêtes justes voisines avant la formule ?",sc:[{who:"Sacha",txt:"Rouge sur rouge, bleu sur bleu, voisines. Où je les place avant le Sune ?"}],
  o:["Derrière et à droite","Devant et à gauche","Devant et derrière","À gauche et derrière"],a:0,w:"Les arêtes justes derrière et à droite : la formule échange celles de devant et de gauche. Tenues devant et à gauche, elle les échangerait."},
 {t:"tiles",q:"Reconstitue la formule de l'étape 5.",a:["R","U","R'","U","R","U2","R'","U"],dd:["R2","U'","L"],w:"R U R' U R U2 R' U : les sept premiers coups forment le Sune, le U final réaligne le dessus. Rythme : U, U, U2."},
 {t:"order",q:"Remets dans l'ordre le cas de deux arêtes opposées.",it:["Les deux arêtes justes sont face à face","Faire la formule une fois, de n'importe quelle position","Tourner U : deux arêtes voisines apparaissent","Reprendre le cas des arêtes voisines"],w:"Opposées : une formule, puis tu as des voisines."},
 {t:"sort",q:"Cette arête jaune est-elle bien placée ?",bins:["Bien placée","Mal placée"],it:[["Arête jaune et rouge au-dessus du centre rouge",0],["Arête jaune et bleue au-dessus du centre vert",1],["Arête jaune et orange au-dessus du centre orange",0],["Arête jaune et verte au-dessus du centre rouge",1]],w:"Une arête est bien placée si sa couleur de côté est au-dessus du centre de même couleur."},
 {t:"tf",q:"Il est toujours possible, en tournant U, d'aligner au moins deux arêtes jaunes avec leurs centres.",a:true,w:"Vrai : on tourne U jusqu'à avoir au moins deux arêtes bien placées. C'est toujours possible. On ne vérifie jamais sans avoir tourné U d'abord."}
 ]},
{id:"coinsjaunes",t:"La panique de Thierry : placer, puis tourner les coins jaunes",mods:[300],
 ctx:"Dernière ligne droite. Thierry tourne son premier coin jaune avec R' D' R D et lève les yeux : les deux couches du bas sont en miettes. Il veut tout recommencer. Inès lui attrape le poignet : ne lâche pas le cube, ne le tourne pas, continue.",
 cards:[
 {t:"story",q:"Que dis-tu à Thierry ?",sc:[{who:"Thierry",txt:"J'ai tout cassé ! Je recommence tout depuis le début ?"}],
  o:["Non : continue avec U, le bas se répare à la fin","Oui : mieux vaut repartir de zéro avec la croix blanche","Non : retourne le cube et vérifie la face blanche d'abord","Oui : défais les mouvements un par un en sens inverse"],a:0,w:"Ne lâche pas, ne tourne pas, continue. Entre deux coins, tu tournes uniquement U."},
 {t:"match",q:"Associe l'orientation du jaune au nombre de R' D' R D.",p:[["Le jaune regarde à droite","2 fois"],["Le jaune regarde devant toi","4 fois"],["Le jaune est déjà en haut","0 fois, on passe au coin suivant"]],w:"« Droite 2, devant 4. » Si le jaune est déjà en haut, on tourne U seulement pour amener le coin suivant devant à droite."},
 {t:"tiles",q:"Reconstitue la formule qui place les coins.",a:["U","R","U'","L'","U","R'","U'","L"],dd:["D'","B","F"],w:"U R U' L' U R' U' L : en deux moitiés miroirs. Le coin devant à droite reste, les trois autres tournent en rond."},
 {t:"num",q:"Un coin à tourner a le jaune devant toi : 4 fois R' D' R D. Combien de mouvements ?",a:16,tol:0.1,w:"4 x 4 = 16 mouvements pour un seul coin. Puis U pour le coin suivant."},
 {t:"tf",q:"Un coin est bien placé s'il est entre les trois bons centres, même si son jaune n'est pas en haut.",a:true,w:"Vrai : l'étape 6 place les coins, l'étape 7 les tourne. Peu importe le sens du jaune à l'étape 6."}
 ]},
{id:"depannage",t:"Le cube qui ne voulait pas finir : diagnostic et cubes impossibles",mods:[301],
 ctx:"Thierry revient furieux : tout marche jusqu'à la fin, puis il lui reste un seul coin jaune tourné de travers. Il a refait trois fois. Inès retourne le vieux cube de 1981 : Thierry l'avait démonté pour le nettoyer.",
 cards:[
 {t:"story",q:"Que diagnostique Inès ?",sc:[{who:"Thierry",txt:"Un seul coin tourné de travers à la fin. Quelle formule secrète je dois apprendre ?"}],
  o:["Aucune : le cube est impossible depuis son démontage","La formule de la croix jaune, répétée jusqu'au bout du cube","La formule du Sune, tenue à l'envers à la fin","Une formule de CFOP, il faut apprendre le PLL"],a:0,w:"Un coin tourné seul, une arête retournée seule : cube démonté et mal remonté. Aucune formule ne règle ces cas."},
 {t:"sort",q:"À quelle étape reprends-tu si c'est cassé ?",bins:["Étape 1, la croix","Étape 2, les coins blancs","Étape 3, la deuxième couche","Étape 4, la croix jaune"],it:[["La croix blanche et ses T sont faux",0],["La face blanche est fausse, la croix est juste",1],["Les quatre arêtes du milieu sont fausses",2],["Les deux couches sont justes, la croix jaune est fausse",3]],w:"« Du bas vers le haut, la première fissure ». On cherche la première brique tombée en partant du sol."},
 {t:"num",q:"Si on remonte un cube au hasard, il y a 1 chance sur 12 qu'il soit soluble. Sur 60 cubes remontés au hasard, combien sont solubles en moyenne ?",a:5,tol:0.1,w:"60 / 12 = 5. Le 12 vient de 2 x 3 x 2 : sens des arêtes, sens des coins, ordre des pièces."},
 {t:"multi",q:"Coche tout ce qui sert à bien entretenir un cube.",o:["Un lubrifiant pour cube à base de silicone, quelques gouttes","Démonter à 45 degrés en soulevant une arête du dessus","Remonter toujours le cube résolu, pièces dans le bon sens","Le régler avec les vis pour une bonne tension","Utiliser un dégrippant de bricolage pour lubrifier"],a:[0,1,2,3],w:"Dégrippants et huiles de bricolage peuvent abîmer le plastique. Un pop est une pièce qui saute, un lock-up une face qui bloque."},
 {t:"tf",q:"Un cube 3x3 bloqué à la fin demande toujours une formule secrète.",a:false,w:"Faux : si les étapes ont été bien faites, un coin tourné seul ou une arête retournée seule signale un cube trafiqué. La solution est mécanique : démonter la pièce fautive et la remettre dans le bon sens."}
 ]},
{id:"chrono",t:"Le premier chrono : moyenne de 5, inspection et records",mods:[302],
 ctx:"Thierry résout son cube tous les soirs et pose fièrement son téléphone : 2 minutes 40. Sacha lui montre ses doigts : les index frappent le dessus comme des pianistes. En compétition, Thierry fera cinq résolutions : 50, 48, 62, 45 et 55 secondes.",
 cards:[
 {t:"num",q:"Calcule la moyenne de 5 (ao5) de Thierry : 50, 48, 62, 45 et 55 secondes.",a:51,tol:0.1,un:" s",h:"On retire la meilleure et la moins bonne.",w:"On retire 45 et 62. (50 + 48 + 55) / 3 = 153 / 3 = 51 secondes."},
 {t:"num",q:"Thierry démarre sa résolution après 16 secondes d'inspection et la termine en 48 s. Quel est son temps officiel, en secondes ?",a:50,tol:0.1,un:" s",w:"Entre 15 et 17 secondes : pénalité de +2. 48 + 2 = 50 secondes. Au-delà de 17 secondes : DNF."},
 {t:"match",q:"Associe chaque situation au résultat officiel.",p:[["Démarrer à 14 secondes","Aucune pénalité"],["Démarrer à 16 secondes","+2 secondes"],["Démarrer à 18 secondes","DNF, résolution annulée"]],w:"15 secondes d'inspection, +2 jusqu'à 17 s, DNF au-delà."},
 {t:"story",q:"Quel conseil donnes-tu à Thierry pour descendre sous 2 minutes ?",sc:[{who:"Thierry",txt:"Je tourne le plus vite possible, mais mon cube bloque et je m'arrête après chaque formule. Que faire ?"}],
  o:["Tourne plus lentement, sans pause, en regardant la pièce suivante","Tourne encore plus fort : la force fait baisser le chrono","Fais des pauses plus longues pour mieux préparer chaque formule","Change de cube chaque jour pour trouver un geste plus rapide"],a:0,w:"Le chrono ne baisse pas parce que tu tournes plus fort, mais quand tu ne t'arrêtes plus. Le lookahead : chercher la pièce suivante pendant la formule."},
 {t:"tf",q:"Le record du monde en une résolution est de 3,76 secondes (février 2026), par Teodor Zajder.",a:false,w:"Faux : il est de 2,76 secondes, le premier record officiel sous les 3 secondes. Les records tombent souvent : vérifie sur le site de la WCA."}
 ]},
{id:"cfop",t:"Le passage à la CFOP : seize formules, pas soixante-dix-huit",mods:[303],
 ctx:"Trois mois ont passé. Thierry tourne à 1 minute 20 et ne descend plus. Sacha lui tend une feuille avec seize petits dessins jaunes : la méthode CFOP. Thierry est découragé : seize formules, c'est beaucoup. Inès rappelle qu'il en connaît déjà quatre.",
 cards:[
 {t:"match",q:"Associe chaque lettre de CFOP à son étape.",p:[["C","Cross, la croix blanche directement en dessous"],["F","F2L, les deux premières couches par paires coin et arête"],["O","OLL, orienter le dessus tout jaune"],["P","PLL, placer les pièces du dessus"]],w:"« Croix, Fondations, Orienter, Placer. » Méthode popularisée par Jessica Fridrich."},
 {t:"num",q:"Le 2-look OLL compte 10 formules et le 2-look PLL en compte 6. Combien de formules à apprendre pour le 2-look complet ?",a:16,tol:0.1,w:"10 + 6 = 16 formules, assez pour descendre sous les 30 secondes. Apprendre les 78 (57 OLL et 21 PLL) n'est pas nécessaire pour débuter."},
 {t:"story",q:"Que dis-tu à Thierry, qui veut apprendre les 78 formules d'un coup ?",sc:[{who:"Thierry",txt:"Il paraît qu'il faut apprendre les 78 formules de la CFOP. Je m'y mets ce week-end ?"}],
  o:["Non : le 2-look, seize formules, suffit pour débuter","Oui : plus tu en connais, plus ton temps baisse vite","Non : la CFOP est réservée aux gens qui font moins de 10 secondes","Oui : la CFOP exige les 78 formules dès le premier jour"],a:0,w:"Le 2-look OLL et PLL, avec 16 formules, suffit pour descendre sous les 30 secondes."},
 {t:"sort",q:"Méthode débutant ou CFOP ?",bins:["Méthode débutant","CFOP"],it:[["Croix blanche en dessous, directement",1],["Marguerite puis petits T",0],["Coin et arête posés ensemble, par paires",1],["Coin puis arête, l'un après l'autre",0],["Sept étapes",0]],w:"Le F2L est l'étape qui fait gagner le plus de temps : on pose un coin et son arête ensemble."},
 {t:"tf",q:"Dans le F2L, il existe 41 cas, qu'on apprend d'abord à l'intuition, en comprenant le geste.",a:true,w:"Vrai : quatre paires et les deux couches sont finies. Un cas de base : R U R' pose la paire."}
 ]},
{id:"synthese",t:"Le tournoi de la médiathèque : résoudre seul, s'entraîner",mods:[304],
 ctx:"Six mois après le premier samedi, la médiathèque de Tourcoing organise un petit tournoi. Thierry s'assoit et pose les mains sur le tapis. Quinze secondes d'inspection, il cherche sa croix sans toucher le cube. Mains levées. Croix, paires, OLL, PLL. 38 secondes.",
 cards:[
 {t:"order",q:"Remets dans l'ordre les sept étapes de la méthode débutant.",it:["Croix blanche","Coins blancs","Deuxième couche","Croix jaune","Arêtes jaunes (Sune)","Placer les coins jaunes","Tourner les coins jaunes"],w:"« Fleur, Lessive, Milieu, Croix, Soleil, Ronde, Tourne. »"},
 {t:"match",q:"Associe chaque étape à son geste clé.",p:[["Coins blancs","R U R' U' : droite 1, haut 3, devant 5"],["Croix jaune","F R U R' U' F'"],["Arêtes jaunes","R U R' U R U2 R' U"],["Placer les coins jaunes","U R U' L' U R' U' L"],["Tourner les coins jaunes","R' D' R D : droite 2, devant 4"]],w:"Sept étapes, sept gestes, tous dans tes doigts."},
 {t:"num",q:"Routine conseillée : 15 minutes par jour. Combien de minutes d'entraînement par semaine ?",a:105,tol:0.1,un:" min",w:"15 x 7 = 105 minutes, soit presque 2 heures. 15 minutes par jour battent une soirée par mois."},
 {t:"story",q:"Que dis-tu à un ami qui veut commencer par la CFOP ?",sc:[{who:"Un ami",txt:"Je veux apprendre la CFOP tout de suite, pour gagner du temps. Bonne idée ?"}],
  o:["Non : d'abord finir seul, puis aller vite, enfin la CFOP","Oui : la CFOP est plus simple que la méthode débutant","Non : la CFOP ne se pratique qu'avec un cube magnétique","Oui : tu gagneras plusieurs minutes dès le premier jour"],a:0,w:"Le piège : on empile des formules qu'on ne sait pas où placer. Ordre qui marche : méthode débutant automatique, puis vitesse, puis CFOP."},
 {t:"tf",q:"Une marguerite est composée de quatre arêtes blanches autour du centre jaune.",a:true,w:"Vrai : la marguerite se fait sans aucune formule. Le sexy move, lui, désigne R U R' U'."}
 ]}
]
}
