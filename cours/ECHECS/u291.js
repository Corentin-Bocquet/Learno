/*UNIT*/
{id:291,c:"ECHECS",n:"Module 13",t:"Milieu de partie et progression : plans, Elo, routine d'entraînement",col:"--purple",ic:"📈",guide:`
<h3>Ce que tu dois savoir faire</h3>
<ul><li>Trouver un <b>plan simple</b> en milieu de partie.</li>
<li>Comprendre ce que mesure l'<b>Elo</b> et situer ton palier.</li>
<li>Construire ta <b>routine quotidienne</b> d'entraînement.</li>
<li>Choisir tes <b>ressources</b> : Lichess, Chess.com, Chessable, Chernev.</li></ul>
<h3>Le tableau de Viktor</h3>
<div class="gstory">Un dimanche, Viktor affiche au mur du club un grand tableau à quatre marches : 0, 400, 800, 1200, 1500. Chacun colle une gommette à son niveau. Baptiste, 650 sur Lichess, se place entre 400 et 800. Léna, 1400, sur la dernière marche. Viktor : « Chaque marche a son travail. Baptiste, toi, ce n'est pas une nouvelle ouverture qu'il te faut. Ce sont des puzzles de fourchettes, quinze minutes par jour. »</div>
<h3>Les plans de milieu de partie</h3>
<table><tr><th>Idée</th><th>Ce que tu fais</th></tr>
<tr><td><b>Colonne ouverte</b></td><td>Mets une tour sur une colonne sans pions : elle entre chez l'adversaire.</td></tr>
<tr><td><b>Avant-poste</b></td><td>Installe un cavalier sur une case qu'aucun pion adverse ne peut attaquer.</td></tr>
<tr><td><b>Paire de fous</b></td><td>Garde tes deux fous, ils valent un peu plus que 6 points dans une position ouverte.</td></tr>
<tr><td><b>Pièce la moins active</b></td><td>Améliore ta plus mauvaise pièce quand tu ne sais pas quoi jouer.</td></tr>
<tr><td><b>Attaquer où tu es fort</b></td><td>Joue du côté où tu as plus de pièces et d'espace.</td></tr></table>
<div class="gmnemo">Quand tu n'as pas d'idée : <b>« la plus mauvaise pièce d'abord »</b>. Regarde tes pièces, trouve celle qui ne fait rien, et donne-lui un travail.</div>
<h3>L'Elo, c'est quoi ?</h3>
<ul><li>L'<b>Elo</b> est un classement qui mesure ta force par rapport aux autres joueurs.</li>
<li>Gagner contre plus fort rapporte beaucoup, perdre contre plus faible coûte beaucoup.</li>
<li>Un écart de <b>400 points</b> veut dire que le plus fort marque environ <b>91 %</b> des points.</li>
<li>À 1500, tu bats la grande majorité des joueurs occasionnels.</li></ul>
<div class="gtrap">Ta formation parle d'« Elo » pour tous les classements. En réalité, <b>Lichess</b> et <b>Chess.com</b> utilisent un système voisin, Glicko, et leurs chiffres ne se comparent ni entre eux, ni avec l'Elo <b>FIDE</b> des tournois officiels. Compare-toi toujours sur le même site, à la même cadence.</div>
<h3>La feuille de route</h3>
<table><tr><th>Palier</th><th>Focus</th><th>Travail</th></tr>
<tr><td><b>0 à 400</b></td><td>Fondations</td><td>Règles, valeur des pièces, roque, échec, mat, pat. Mats en un coup.</td></tr>
<tr><td><b>400 à 800</b></td><td>Tactique de base</td><td>Fourchette et clouage, 15 min de puzzles par jour. É.P.M. à chaque coup.</td></tr>
<tr><td><b>800 à 1200</b></td><td>Structure</td><td>Une ouverture Blancs, une ou deux réponses Noirs. Finales de base. Analyse moteur des défaites.</td></tr>
<tr><td><b>1200 à 1500+</b></td><td>Régularité</td><td>Combinaisons à 2 ou 3 coups, gestion du temps, plans de milieu de partie.</td></tr></table>
<h3>La routine quotidienne</h3>
<div class="formula">15 à 20 min de puzzles + 1 à 2 parties longues + analyse de la partie perdue</div>
<ul><li>La <b>régularité</b> bat largement les sessions marathon.</li>
<li>Analyse d'abord <b>seul</b>, puis vérifie avec le <b>moteur</b> : cherche le coup où tout a basculé.</li>
<li>Répertoire : <b>2 à 3 ouvertures</b> au total, apprises en profondeur.</li></ul>
<h3>Les ressources</h3>
<table><tr><th>Ressource</th><th>Pourquoi</th></tr>
<tr><td><b>Lichess</b></td><td>Gratuit, puzzles illimités, analyse moteur gratuite, sans publicité.</td></tr>
<tr><td><b>Chess.com</b></td><td>Le plus populaire, des adversaires à toute heure, Puzzle Rush.</td></tr>
<tr><td><b>Chessable</b></td><td>Cours structurés avec répétition espacée pour les ouvertures.</td></tr>
<tr><td><b>Logical Chess: Move by Move</b> (Chernev)</td><td>33 parties commentées coup par coup, la logique de chaque coup.</td></tr></table>
<h3>Ce que tu dois retenir</h3>
<ul><li>Sans idée, améliore ta plus mauvaise pièce.</li>
<li>Chaque palier a son travail : tactique avant ouvertures.</li>
<li>Puzzles, parties longues, analyse de la défaite, chaque jour.</li>
<li>Compare ton classement sur un seul site.</li></ul>`},
/*EXOS*/
{i:"e291_01",u:291,t:"mcq",d:.2,nw:"Les plans de milieu de partie",q:"Où placer une tour en milieu de partie ?",o:["Sur une colonne ouverte","Derrière ses propres pions","Dans le coin, sans bouger","Devant son roi roqué"],a:0,w:"Une colonne sans pions est une autoroute : la tour entre chez l'adversaire. Le cavalier, lui, cherche un avant-poste."},
{i:"e291_02",u:291,t:"fill",d:.2,q:"Une case qu'aucun pion adverse ne peut attaquer, idéale pour un cavalier, est un ___.",o:["avant-poste","trou d'air","coin du roi","gambit"],a:0,w:"Un cavalier sur un avant-poste ne peut être chassé que par une pièce."},
{i:"e291_03",u:291,t:"story",d:.25,q:"Que dit Viktor à Baptiste ?",sc:[{who:"Baptiste",txt:"Je suis en milieu de partie, rien ne se passe, je ne sais pas quoi jouer."}],o:["Améliore ta plus mauvaise pièce","Sors ta dame pour attaquer vite","Pousse les pions devant ton roi","Propose la nulle et rentre chez toi"],a:0,w:"Sans idée : trouve la pièce qui ne fait rien et donne-lui un travail."},
{i:"e291_04",u:291,t:"tf",d:.25,q:"La paire de fous vaut un peu plus que 6 points, surtout dans une position ouverte.",a:true,w:"Deux fous couvrent les deux couleurs de cases. Garde-les quand tu peux."},
{i:"e291_05",u:291,t:"match",d:.3,q:"Associe chaque idée à son action.",p:[["Colonne ouverte","Y placer une tour"],["Avant-poste","Y installer un cavalier"],["Paire de fous","La garder"],["Pièce inactive","Lui donner un travail"]],w:"Cinq idées simples de plans, sans théorie."},
{i:"e291_06",u:291,t:"sort",d:.3,q:"Bon plan ou mauvaise idée ?",bins:["Bon plan","Mauvaise idée"],it:[["Doubler ses tours sur la colonne ouverte",0],["Échanger son fou actif contre un cavalier passif sans raison",1],["Installer un cavalier en d5 où aucun pion ne l'attaque",0],["Attaquer du côté où l'adversaire a toutes ses pièces",1]],w:"Joue où tu es fort, garde tes bonnes pièces, occupe les lignes ouvertes."},
{i:"e291_07",u:291,t:"mcq",d:.35,nw:"L'Elo",q:"Que mesure l'Elo ?",o:["Ta force face aux autres","Le nombre de parties jouées","Ta vitesse de jeu moyenne","Le nombre d'ouvertures sues"],a:0,w:"Un classement relatif : il monte quand tu bats plus fort, il baisse quand tu perds contre plus faible. Lichess et Chess.com utilisent une variante, Glicko."},
{i:"e291_08",u:291,t:"slider",d:.35,q:"Avec 400 points d'écart, quel pourcentage des points marque le plus fort, environ ?",min:50,max:100,step:1,a:91,tol:2,pre:"",un:" %",w:"Environ 91 % selon la formule Elo. À 200 points d'écart, environ 76 %."},
{i:"e291_09",u:291,t:"story",d:.35,q:"Que réponds-tu à Baptiste ?",sc:[{who:"Baptiste",txt:"Je suis 1100 sur Lichess et 800 sur Chess.com. Je suis nul sur Chess.com ?"}],o:["Non, ces deux échelles diffèrent","Oui, tu joues moins bien sur Chess.com","Oui, un des deux sites triche forcément","Non, tu es en réalité 1900 Elo FIDE"],a:0,w:"Piège de la formation : sites et FIDE ont des échelles différentes. Compare-toi sur un seul site, à la même cadence."},
{i:"e291_10",u:291,t:"tf",d:.4,q:"Un classement Lichess se compare directement à un Elo FIDE.",a:false,w:"Lichess utilise Glicko-2, avec sa propre échelle. L'Elo FIDE ne concerne que les tournois officiels homologués."},
{i:"e291_11",u:291,t:"order",d:.4,nw:"La feuille de route",q:"Remets dans l'ordre les paliers de la feuille de route.",it:["Fondations : règles, valeur, mat en un coup","Tactique de base : fourchette, clouage, É.P.M.","Structure : ouvertures, finales, analyse moteur","Régularité : combinaisons, temps, plans"],w:"0-400, 400-800, 800-1200, 1200-1500+ : chaque marche a son travail, dans cet ordre."},
{i:"e291_12",u:291,t:"story",d:.4,q:"Que dit Viktor à Baptiste, 650 Elo ?",sc:[{who:"Baptiste",txt:"Je vais apprendre la Najdorf, c'est l'ouverture des champions."}],o:["À ton palier, des puzzles de tactique d'abord","Excellente idée, apprends 30 coups de théorie","Oui, et ajoute trois autres ouvertures","Non, apprends plutôt les finales de tours"],a:0,w:"Palier 400-800 : fourchette et clouage, 15 min de puzzles par jour, É.P.M. à chaque coup."},
{i:"e291_13",u:291,t:"sort",d:.45,q:"À quel palier travailler ceci ?",bins:["0 à 800","800 à 1500"],it:[["Mats en un coup",0],["Finales roi et pion, opposition",1],["Fourchette et clouage en puzzles",0],["Combinaisons à 2 ou 3 coups",1],["Valeur des pièces et roque",0]],w:"Les fondations et la tactique de base d'abord, la structure et la régularité ensuite."},
{i:"e291_14",u:291,t:"fill",d:.45,nw:"La routine quotidienne",q:"Routine conseillée : 15 à 20 minutes de ___ par jour.",o:["puzzles","blitz","théorie","bullet"],a:0,w:"Plus 1 à 2 parties longues et l'analyse de la partie perdue."},
{i:"e291_15",u:291,t:"multi",d:.45,q:"Quels éléments font partie de la routine quotidienne de ta formation ?",o:["15 à 20 min de puzzles","1 à 2 parties longues","Analyse de la partie perdue","50 parties de bullet","Apprendre une ouverture par jour"],a:[0,1,2],w:"La régularité bat les sessions marathon."},
{i:"e291_16",u:291,t:"tf",d:.5,q:"Selon ta formation, la régularité bat largement les sessions marathon ponctuelles.",a:true,w:"20 minutes chaque jour valent mieux que 5 heures le dimanche."},
{i:"e291_17",u:291,t:"story",d:.5,q:"Que conseilles-tu à Léna ?",sc:[{who:"Léna",txt:"J'ai perdu. J'ouvre direct le moteur pour voir mes erreurs ?"}],o:["Analyse seule, puis vérifie au moteur","Oui, le moteur suffit, inutile de réfléchir","Non, n'analyse jamais une défaite","Oui, et rejoue vite une autre partie"],a:0,w:"Chercher seule le coup où tout a basculé fait progresser. Le moteur vérifie ensuite."},
{i:"e291_18",u:291,t:"num",d:.5,q:"20 minutes de puzzles par jour pendant 30 jours. Combien d'heures de tactique au total ?",a:10,tol:0,un:" h",h:"20 x 30 = 600 min",w:"600 minutes = 10 heures de tactique par mois, sans effort de marathon."},
{i:"e291_19",u:291,t:"match",d:.55,nw:"Les ressources",q:"Associe chaque ressource à son point fort.",p:[["Lichess","Gratuit, analyse moteur sans pub"],["Chess.com","Adversaires à toute heure, Puzzle Rush"],["Chessable","Répétition espacée pour les ouvertures"],["Chernev","33 parties commentées coup par coup"]],w:"Quatre ressources, quatre usages : jouer, s'entraîner, apprendre une ouverture, comprendre."},
{i:"e291_20",u:291,t:"mcq",d:.55,q:"Quelle ressource est entièrement gratuite avec analyse moteur ?",o:["Lichess","Chessable","Un livre de Chernev","Un club payant"],a:0,w:"Lichess : gratuit, puzzles illimités, analyse moteur, zéro pub."},
{i:"e291_21",u:291,t:"tf",d:.55,q:"Logical Chess: Move by Move de Chernev explique la logique de chaque coup sur 33 parties.",a:true,w:"La référence débutant citée par ta formation."},
{i:"e291_22",u:291,t:"story",d:.6,q:"Rappel du module 6 : que dit Viktor ?",sc:[{who:"Baptiste",txt:"J'ai appris 15 ouvertures en surface ce mois-ci."}],o:["Deux ou trois, bien apprises, suffisent largement","Parfait, vise 30 le mois prochain","Il faut en connaître au moins 20","Les ouvertures ne servent à rien du tout"],a:0,w:"Mieux vaut bien connaître 3 systèmes que survoler 15 ouvertures."},
{i:"e291_23",u:291,t:"tiles",d:.6,q:"Reconstitue la règle du milieu de partie.",a:["La","plus","mauvaise","pièce","d'abord"],dd:["dame","vite"],w:"Donne un travail à la pièce qui ne fait rien."},
{i:"e291_24",u:291,t:"fill",d:.6,q:"Lichess et Chess.com utilisent un système voisin de l'Elo appelé ___.",o:["Glicko","Stockfish","FIDE","Blitz"],a:0,w:"Leurs chiffres ne se comparent ni entre eux, ni avec l'Elo FIDE."},
{i:"e291_25",u:291,t:"story",d:.65,q:"Rappel du module 11 : que dit Viktor ?",sc:[{who:"Léna",txt:"Pour passer 1500, je devrais jouer plus vite en tournoi ?"}],o:["Non, gère ton temps : É.P.M. à chaque coup","Oui, jouer vite impressionne l'adversaire","Oui, passe tout ton entraînement en bullet","Non, joue sans pendule en tournoi"],a:0,w:"Gestion du temps au palier 1200-1500 : garde du temps pour les moments critiques, sans sauter É.P.M."},
{i:"e291_26",u:291,t:"sort",d:.65,q:"Classe chaque ressource.",bins:["Pour jouer et s'entraîner","Pour apprendre en cours ou livre"],it:[["Lichess",0],["Chessable",1],["Chess.com",0],["Logical Chess de Chernev",1]],w:"Les sites pour jouer et faire des puzzles, les cours et livres pour comprendre."},
{i:"e291_27",u:291,t:"multi",d:.7,q:"Que travailler au palier 1200 à 1500+ ?",o:["Combinaisons à 2 ou 3 coups","Gestion du temps","Plans de milieu de partie","Apprendre comment bouge le cavalier"],a:[0,1,2],w:"Le déplacement des pièces appartient au palier 0 à 400."},
{i:"e291_28",u:291,t:"num",d:.7,q:"Tu es 1000 et tu vises 1500 en gagnant 25 points par mois. Combien de mois ?",a:20,tol:0,un:" mois",h:"500 / 25",w:"20 mois : environ un an et demi de régularité. Ordre de grandeur réaliste pour un adulte."},
{i:"e291_29",u:291,t:"tf",d:.7,q:"Selon ta formation, sous 1500 Elo, la stratégie fine décide presque toutes les parties.",a:false,w:"Au contraire : la gaffe et la tactique décident. Mets 80 % de ton temps là-dessus."},
{i:"e291_30",u:291,t:"story",d:.75,q:"Que dit Viktor ?",sc:[{who:"Baptiste",txt:"80 % de mon temps sur quoi, exactement ?"}],o:["Ne rien offrir, roquer, voir la tactique","Apprendre des ouvertures jusqu'au 20e coup","Étudier les finales de tours complexes","Mémoriser des parties de champions du monde"],a:0,w:"Le verdict de ta formation : sous 1500, qui gaffe le moins et voit la tactique en premier gagne."},
{i:"e291_31",u:291,t:"slider",d:.75,q:"Combien d'ouvertures maximum au total dans ton répertoire, selon ta formation ?",min:1,max:15,step:1,a:3,tol:0,pre:"",un:" ouvertures",w:"2 à 3 ouvertures au total, apprises en profondeur."},
{i:"e291_32",u:291,t:"mcq",d:.8,q:"Quelle phrase résume la progression vers 1500 Elo ?",o:["Chaque palier a son travail, chaque jour","Plus on joue vite, plus on progresse vite","Les ouvertures font gagner avant tout","Le classement se compare entre tous les sites"],a:0,w:"Feuille de route, routine quotidienne, plans simples, classement sur un seul site."}
