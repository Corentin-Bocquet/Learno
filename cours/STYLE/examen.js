/*EXAMEN*/
{
cases:[
{id:"veste",t:"Chez Adrien : la veste qui ne tombe pas bien",mods:[23],
 ctx:"Adrien, 32 ans, cadre, a payé une veste 300 euros. Sur lui, la couture d'épaule tombe 2 cm après l'os, la manche cache toute la chemise et la veste fermée serre le torse. Il a un ventre marqué (morphologie O). Il te demande si le retoucheur peut tout arranger.",
 cards:[
 {t:"sort",q:"Pour chaque défaut, le retoucheur peut-il l'arranger ?",bins:["Rattrapable","Pas rattrapable"],it:[["Manche trop longue",0],["Épaule qui tombe trop loin de l'os",1],["Longueur un peu trop courte pour couvrir les fesses",1],["Taille un peu trop large",0]],w:"L'épaule est le seul point qu'un retoucheur ne peut pas rattraper. Vérifie-la avant d'acheter."},
 {t:"story",q:"Que dis-tu à Adrien ?",sc:[{who:"Adrien",txt:"J'ai payé 300 euros. Elle est de très bonne marque, ça devrait aller, non ?"}],
  o:["Une veste à 30 euros bien ajustée rend mieux qu'une veste à 300 euros mal coupée","Une grande marque s'ajuste toujours bien à la morphologie O, sans retouche","Un vêtement à 300 euros fait oublier un défaut d'épaule aux autres","Il suffit de la porter ouverte pour que l'épaule se remette en place"],a:0,w:"Avant la marque et avant la couleur, il y a la coupe. Un vêtement mal ajusté rend moins bien qu'un modèle moins cher à la bonne taille."},
 {t:"multi",q:"Coche tous les points d'ajustement d'une veste qui tombe bien.",o:["La couture d'épaule tombe pile sur l'os","Un poing passe entre la veste fermée et le torse","La manche laisse voir 1 à 1,5 cm de chemise","La veste couvre les fesses, bras le long du corps","La veste est cintrée au maximum pour affiner la silhouette"],a:[0,1,2,3],w:"Quatre points : épaule, poitrine, manche, longueur. Pour une morphologie O, éviter de trop cintrer."},
 {t:"match",q:"Associe chaque morphologie au conseil.",p:[["V (épaules larges, hanches étroites)","Pas d'épaulettes, bas plus structurés"],["H (droit)","Créer du relief avec superpositions et vestes cintrées"],["O (ventre marqué)","Verticales, veste ouverte, ne pas trop cintrer"],["A (hanches plus larges)","Structurer les épaules, alléger le bas"]],w:"On équilibre la silhouette : on structure ce qui est étroit, on allège ce qui est large."},
 {t:"tf",q:"Une silhouette est plus agréable quand elle est coupée en deux parts égales, haut et bas.",a:false,w:"Faux : on vise un rapport proche de 1/3 - 2/3. Une veste trop longue ou un pantalon taille basse cassent l'allure."}
 ]},
{id:"couleurs",t:"Le pull orange d'Hugo : couleurs, 60-30-10 et sous-ton",mods:[24],
 ctx:"Hugo veut porter un pull orange, un pantalon bleu et une ceinture verte. Il a la peau qui rougit au soleil, des veines bleues au poignet, des cheveux foncés et une peau claire. Il ne sait pas pourquoi ses tenues font sapin de Noël.",
 cards:[
 {t:"sort",q:"Classe chaque association de couleurs.",bins:["Complémentaires","Analogues","Neutres"],it:[["Bleu et orange",0],["Bleu, bleu-vert et vert",1],["Marine, gris et beige",2],["Violet et jaune",0],["Vert et rouge",0]],w:"Neutres : base de la garde-robe. Complémentaires : contraste fort, par petites touches. Analogues : harmonie douce."},
 {t:"num",q:"Sur une tenue de 10 éléments visibles (règle 60-30-10), combien en comptes-tu en couleur dominante ?",a:6,tol:0.1,w:"60 % de 10 = 6, 30 % = 3 pour la secondaire, 10 % = 1 pour l'accent (ceinture, chaussettes, pochette)."},
 {t:"story",q:"Que conseilles-tu à Hugo sur le sous-ton ?",sc:[{who:"Hugo",txt:"Ma peau rougit au soleil, mes veines sont bleues. Je mets du camel et de l'olive ?"}],
  o:["Non : sous-ton froid, marine, gris, bordeaux, bleu glacier","Oui : sous-ton chaud, camel, olive, terracotta","Non : sous-ton neutre, donc uniquement du blanc et du noir","Oui : le camel va à tous les sous-tons sans distinction"],a:0,w:"Sous-ton chaud : veines vertes, la peau dore. Sous-ton froid : veines bleues, la peau rougit."},
 {t:"story",q:"Quel conseil sur le contraste ?",sc:[{who:"Hugo",txt:"Cheveux foncés, peau claire. Je peux porter du blanc franc et du noir ?"}],
  o:["Oui : fort contraste, blanc et noir francs","Non : le noir et le blanc durcissent toujours le visage","Oui, mais seulement avec un accessoire orange en touche","Non : porte uniquement des tons doux et proches de ta peau"],a:0,w:"Faible contraste (cheveux et peau proches) : tons doux. Fort contraste : couleurs franches."},
 {t:"tf",q:"Les neutres (marine, gris, blanc, noir, beige, kaki, marron) sont des couleurs à utiliser seulement par petites touches.",a:false,w:"Faux : ils se combinent avec presque tout et forment la base de la garde-robe. Ce sont les complémentaires qui s'utilisent par petites touches."}
 ]},
{id:"capsule",t:"Le dressing de 100 pièces : la garde-robe capsule",mods:[25],
 ctx:"Karim a 100 pièces dans son dressing et « rien à se mettre ». Il hésite à acheter un blouson jaune moutarde très marqué. Il possède déjà un chino beige, un chino marine, un jean brut, une chemise blanche et une chemise bleu clair. Objectif : une capsule de 30 pièces.",
 cards:[
 {t:"num",q:"Une capsule de 30 pièces suit le ratio 80 % neutres, 20 % marquées. Combien de pièces marquées ?",a:6,tol:0.1,w:"20 % de 30 = 6 pièces marquées, 24 neutres. C'est le rapport qui te rend reconnaissable sans te rendre esclave d'une mode."},
 {t:"num",q:"Karim a 4 hauts neutres, 3 bas neutres et 2 vestes neutres. Combien de tenues complètes (un haut, un bas, une veste) peut-il former ?",a:24,tol:0.1,w:"4 x 3 x 2 = 24 tenues avec 9 pièces seulement. Voilà la force de la capsule."},
 {t:"story",q:"Que lui dis-tu pour le blouson jaune ?",sc:[{who:"Karim",txt:"Ce blouson jaune est magnifique. Il va avec mon chino beige et mon chino marine. Je l'achète ?"}],
  o:["Non : deux pièces seulement, moins de trois : repose-le","Oui : il se marie avec deux pièces, c'est suffisant pour moi","Oui : il est beau, donc il ira avec tout le reste de ton dressing","Non : le jaune est interdit dans une garde-robe capsule, quoi qu'on fasse"],a:0,w:"Test de la combinatoire : moins de trois pièces avec lesquelles il se marie, on repose. Cette règle divise par deux les achats inutiles."},
 {t:"sort",q:"Cette pièce appartient-elle au socle de la capsule ?",bins:["Socle","Hors socle"],it:[["Chemise blanche",0],["Chino marine",0],["Veste marine non structurée",0],["Blouson jaune moutarde",1],["Sneakers blanches minimalistes",0],["Chemise à motif paisley",1]],w:"Socle : pièces neutres et intemporelles. Les pièces marquées représentent 20 %."},
 {t:"tf",q:"Un dressing de 100 pièces dépareillées donne toujours plus de tenues qu'une capsule de 30 pièces bien choisies.",a:false,w:"Faux : 30 pièces qui se combinent presque toutes donnent plus de tenues utilisables qu'un dressing dépareillé."}
 ]},
{id:"matieres",t:"En boutique : matières, grammage et test du froissement",mods:[26],
 ctx:"Camille cherche un costume pour porter souvent, un pull chaud, une chemise d'été et un manteau d'hiver. Au rayon, le vendeur vante un costume Super 150's et un pull en acrylique à 100 %. Elle froisse le tissu cinq secondes dans sa main et il garde un pli net.",
 cards:[
 {t:"match",q:"Associe chaque vêtement à son grammage.",p:[["Chemise d'été","100 à 120 g/m2"],["Chemise d'hiver","130 à 160 g/m2"],["Costume mi-saison","260 à 300 g/m2"],["Manteau","600 g/m2 et plus"]],w:"Le grammage dit l'épaisseur du tissu et la saison."},
 {t:"story",q:"Que lui dis-tu sur le costume Super 150's ?",sc:[{who:"Camille",txt:"Le vendeur dit que plus le Super est élevé, meilleur est le costume. Je le porte trois fois par semaine."}],
  o:["Super 110's à 130's pour le quotidien : au-delà, plus fragile","Tout à fait : le Super 150's est le meilleur choix pour le quotidien","Le Super n'a aucun rapport avec la qualité ou la solidité","Choisis un Super 80's : plus c'est bas, plus c'est durable"],a:0,w:"Laine : Super 110's à 130's, bon compromis pour un costume porté souvent."},
 {t:"story",q:"Que conclus-tu du test du froissement ?",sc:[{who:"Camille",txt:"Le tissu garde un pli net après cinq secondes. C'est grave ?"}],
  o:["Il se froissera sur toi toute la journée : mauvais signe","Aucune importance : un pli net disparaît après deux heures","C'est le signe d'un tissu en lin de qualité supérieure","C'est normal pour du coton : tous les cotons gardent le pli"],a:0,w:"S'il retrouve sa forme, c'est bon signe. Le lin, lui, se froisse par nature : c'est son charme."},
 {t:"sort",q:"Bon ou mauvais choix ?",bins:["Bon choix","À éviter"],it:[["Cachemire avec la mention 4 fils",0],["Tee-shirt en synthétique près du corps, en grande proportion",1],["Chemise en coton oxford",0],["Pull dont le fil est court et qui bouloche",1]],w:"Les synthétiques retiennent l'odeur et brillent à la lumière. Le cachemire bouloche si le fil est court : regarde 2 fils ou 4 fils."},
 {t:"tf",q:"Le lin se froisse par nature : ce n'est pas un défaut, c'est son charme.",a:true,w:"Vrai : le lin est respirant. Il se froisse, c'est son caractère."}
 ]},
{id:"chaussures",t:"Les chaussures de Paul : hiérarchie, couleur et durée de vie",mods:[27],
 ctx:"Paul a un entretien d'embauche demain en costume marine. Il hésite entre des oxford noirs et des desert boots marron, avec une ceinture marron. Il porte des chaussettes blanches de sport. Il hésite entre une paire à 200 euros ressemelable et une paire à 80 euros.",
 cards:[
 {t:"order",q:"Classe du plus habillé au plus décontracté.",it:["Oxford noir","Derby","Loafer","Boots Chelsea","Sneakers toile"],w:"Oxford noir, Oxford marron, Derby, Monk, Loafer, puis Boots Chelsea, Desert boots, Sneakers cuir, Sneakers toile."},
 {t:"story",q:"Que lui dis-tu pour demain ?",sc:[{who:"Paul",txt:"Costume marine, entretien d'embauche. Oxford noirs ou desert boots marron ?"}],
  o:["Oxford noirs, ceinture noire, chaussettes de ville","Desert boots marron avec la ceinture marron","Sneakers blanches et ceinture marron","Peu importe les chaussures, seule la cravate compte"],a:0,w:"Chaussures noires avec un costume marine ou gris foncé. Ceinture et chaussures dans la même famille de couleur et de finition. Jamais de chaussettes blanches de sport."},
 {t:"num",q:"Une paire à 80 euros remplacée chaque année pendant 5 ans coûte combien en tout ?",a:400,tol:1,un:" €",w:"80 x 5 = 400 euros. Une paire à 200 euros ressemelée trois fois coûte moins cher."},
 {t:"multi",q:"Coche les signes d'une chaussure bien faite.",o:["Cousu Goodyear ou Blake, donc ressemelable","Doublure entièrement en cuir","Tige sans plis grossiers","Embauchoirs en cèdre après chaque port, pour doubler la durée de vie","Semelle collée, qui ne se ressemelle pas, mais coûte moins cher"],a:[0,1,2,3],w:"Une paire à 200 euros ressemelée trois fois coûte moins cher qu'une paire à 80 euros remplacée chaque année."},
 {t:"tf",q:"Des chaussures marron vont avec presque tout sauf un costume marine ou gris foncé.",a:true,w:"Vrai : noires pour le costume marine ou gris foncé, marron pour presque tout le reste."}
 ]},
{id:"accessoires",t:"Le poignet de Théo : la règle du détail unique",mods:[28],
 ctx:"Théo a un poignet fin. Il vient d'acheter une montre de 46 mm, une cravate de 4 cm, une pochette à motif et un blouson à logo apparent. Sa veste neuve a encore l'étiquette de la marque sur la manche, les poches cousues et la fente arrière en X.",
 cards:[
 {t:"story",q:"Que lui dis-tu sur sa montre ?",sc:[{who:"Théo",txt:"Ma montre fait 46 mm. J'ai un poignet fin. C'est ma pièce forte, non ?"}],
  o:["Elle est trop grande : 36 à 40 mm pour un poignet fin","Parfait : plus la montre est grande, plus on voit le style","Elle convient si le bracelet est en métal brillant","Tout dépend de la couleur du cadran uniquement"],a:0,w:"Montre 36 à 40 mm pour un poignet fin, 40 à 44 mm au-delà."},
 {t:"sort",q:"Que fais-tu avec chaque détail d'une veste neuve ?",bins:["À découdre ou ouvrir","À laisser"],it:[["Étiquette de marque sur la manche",0],["Poches cousues",0],["Fente arrière cousue en X",0],["Boutons de manche d'origine",1]],w:"Étiquette à découdre systématiquement, poches ouvertes aux ciseaux proprement, fente arrière retirée."},
 {t:"num",q:"La cravate standard fait 7 à 8 cm de large. Théo en a une de 4 cm. De combien est-elle plus étroite que le minimum ?",a:3,tol:0.1,un:" cm",w:"7 - 4 = 3 cm de moins. La largeur de la cravate doit être en accord avec le revers de la veste."},
 {t:"story",q:"Que dis-tu de sa tenue complète ?",sc:[{who:"Théo",txt:"Montre imposante, pochette à motif, blouson à logo. Ça fait beaucoup de style, non ?"}],
  o:["Trois signaux forts annulent l'effet : un seul suffit","Parfait : plus il y a de signaux forts, plus on retient ton style","Ça va tant que les couleurs sont bien assorties entre elles","Il faut ajouter une écharpe pour équilibrer l'ensemble"],a:0,w:"Un accessoire remarquable par tenue. Trois signaux forts en même temps donnent une impression d'effort."},
 {t:"tf",q:"Des chaussettes qui montrent la peau quand on croise les jambes se règlent avec des chaussettes mi-mollets.",a:true,w:"Vrai : passer aux mi-mollets. C'est un détail qui se voit tout de suite."}
 ]},
{id:"codes",t:"Quatre invitations : décrypter les codes vestimentaires",mods:[29],
 ctx:"Samir reçoit quatre invitations : un mariage en black tie, un cocktail professionnel, un déjeuner en smart casual et un entretien d'embauche. Il n'a pas de smoking. Il hésite sur chaque tenue.",
 cards:[
 {t:"match",q:"Associe chaque code à la bonne tenue.",p:[["Black tie","Smoking, noeud papillon noir, chaussures vernies"],["Cocktail","Costume sombre, cravate, chaussures habillées"],["Smart casual","Jean brut foncé, chemise ou pull fin, veste, boots ou loafers"],["Business casual","Chino ou pantalon de costume, chemise, veste, pas de cravate"],["Casual","Tenue soignée sans veste, sneakers propres acceptées"]],w:"Chaque code a sa grille : du smoking pour le black tie jusqu'à la tenue soignée sans veste pour le casual."},
 {t:"story",q:"Que lui dis-tu pour l'entretien d'embauche ?",sc:[{who:"Samir",txt:"Je veux montrer ma personnalité à l'entretien : chemise à fleurs et sneakers rouges ?"}],
  o:["Marine ou gris, chemise claire, chaussures cirées","Chemise à fleurs : un style fort marque les esprits du jury","Sneakers rouges : un détail unique, c'est la règle du jeu","Jean déchiré : l'authenticité compte avant tout le reste"],a:0,w:"Objectif : que personne ne se souvienne de tes vêtements, seulement de toi. Ton style personnel s'exprimera une fois le poste obtenu."},
 {t:"story",q:"Que conseilles-tu pour le déjeuner dont il ne connaît pas le code ?",sc:[{who:"Samir",txt:"Je ne sais pas comment m'habiller. Je viens en tee-shirt pour être sûr d'être à l'aise ?"}],
  o:["Sois légèrement plus habillé que la moyenne attendue : une veste en trop se pardonne toujours","Viens en tee-shirt : on ne juge jamais personne sur ses vêtements ici","Viens en costume de soirée pour ne rien risquer du tout au déjeuner","Demande à un inconnu de choisir à ta place"],a:0,w:"On pardonne toujours une veste en trop, jamais une tenue trop négligée."},
 {t:"sort",q:"Cette tenue convient-elle au code ?",bins:["Convient","Ne convient pas"],it:[["Black tie : smoking et chaussures vernies",0],["Cocktail : jean troué et sneakers",1],["Business casual : chino, chemise, veste, sans cravate",0],["Smart casual : jean brut foncé avec boots",0]],w:"Habille-toi pour le lieu, l'heure et les gens présents. Black tie, cocktail et smart casual ont chacun leur grille précise."},
 {t:"tf",q:"Pour un entretien, on porte des vêtements marquants pour que le recruteur retienne notre style.",a:false,w:"Faux : l'objectif est que personne ne se souvienne de tes vêtements, seulement de toi. Chaussures cirées, montre discrète, chemise claire."}
 ]},
{id:"retouches",t:"Chez le retoucheur : 50 euros qui valent mieux qu'une pièce de plus",mods:[30],
 ctx:"Maxime a acheté une chemise trop ample, un pantalon trop long et une veste dont les manches sont trop longues. Il pense racheter une pièce à 150 euros. Son costume est porté depuis trois jours de suite.",
 cards:[
 {t:"num",q:"Ourlet de pantalon (12 €), cintrage de chemise (20 €) et raccourcissement des manches (25 €). Quel est le total ?",a:57,tol:0.1,un:" €",w:"12 + 20 + 25 = 57 euros. Un budget de 50 euros de retouches améliore plus une tenue qu'une pièce de 150 euros."},
 {t:"story",q:"Que lui dis-tu ?",sc:[{who:"Maxime",txt:"Je rachète une veste à 150 euros ou je fais retoucher les trois pièces ?"}],
  o:["Retouche : 50 euros valent plus qu'une pièce à 150 euros","Rachète une veste, une retouche ne rattrape jamais rien du tout","Retouche seulement la chemise, le reste n'a aucun effet","Garde tes pièces telles quelles : l'ajustement est secondaire"],a:0,w:"Le retoucheur est ton meilleur investissement."},
 {t:"sort",q:"Le break du pantalon : quel effet ?",bins:["Sans break","Quart de break","Full break"],it:[["L'ourlet effleure la chaussure, silhouette nette et moderne",0],["Un pli léger, le choix le plus sûr",1],["Plusieurs plis, effet classique mais vite négligé",2]],w:"Le quart de break est le choix le plus sûr."},
 {t:"multi",q:"Coche les bons gestes pour faire durer ses vêtements.",o:["Porter un costume deux jours de suite maximum, puis le reposer 24 h sur un cintre large","Laver à 30 degrés et sécher à l'air","Brosser le vêtement après chaque port","Passer un rasoir anti-bouloches sur les mailles, une fois par saison","Porter son costume tous les jours sans jamais le reposer"],a:[0,1,2,3],w:"Une brosse à vêtements après chaque port en dit plus long qu'un pressing tous les mois."},
 {t:"tf",q:"Un costume peut être porté trois jours de suite sans problème s'il est bien brossé.",a:false,w:"Faux : deux jours de suite maximum, puis il se repose 24 h sur un cintre large."}
 ]},
{id:"allure",t:"Le rendez-vous de Léo : coupe, parfum, posture, miroir",mods:[31],
 ctx:"Léo a un rendez-vous important. Sa tenue est simple, sa coupe date de six semaines, sa barbe est dans l'entre-deux flou, il a le dos voûté et s'est vaporisé six fois d'un parfum boisé. Il va au bureau à 14 h puis dîner.",
 cards:[
 {t:"num",q:"On rafraîchit sa coupe toutes les 3 à 5 semaines. Au rythme de 4 semaines, combien de coupes par an (52 semaines) ?",a:13,tol:0.1,w:"52 / 4 = 13 coupes. Une coupe nette rattrape une tenue simple, l'inverse est faux."},
 {t:"story",q:"Que dis-tu à Léo sur le parfum ?",sc:[{who:"Léo",txt:"J'ai mis six pulvérisations de boisé pour être sûr qu'on me remarque."}],
  o:["Deux pulvérisations suffisent : il se découvre de près","Six, c'est parfait : un bon parfum s'annonce à trois mètres de distance","Aucune, le parfum n'a pas sa place avec un costume","Une seule dans le cou, le reste est inutile"],a:0,w:"Le parfum doit se découvrir de près, pas s'annoncer à trois mètres."},
 {t:"match",q:"Associe chaque famille de parfum à son usage.",p:[["Boisées / ambrées","Soirée, hiver, présence marquée"],["Fraîches / hespéridées","Journée, été, bureau"],["Aromatiques / fougères","Polyvalent, passe-partout"]],w:"Pour le bureau à 14 h, une fraîche. Pour le dîner, une boisée."},
 {t:"sort",q:"Bon réflexe ou erreur ?",bins:["Bon réflexe","Erreur"],it:[["Barbe aux contours nets, ou rasé",0],["Barbe dans l'entre-deux flou",1],["Épaules basses et ouvertes, menton parallèle au sol",0],["Dos voûté en comptant sur le costume pour compenser",1]],w:"Aucun vêtement ne compense un dos voûté."},
 {t:"tf",q:"Avant de sortir, on se regarde dans le miroir pendant cinq secondes, de loin plutôt que de près.",a:true,w:"Vrai : on juge une silhouette et une allure d'ensemble, jamais un détail isolé."}
 ]},
{id:"perso",t:"Ton style à toi : méthode et trois questions avant d'acheter",mods:[32],
 ctx:"Nolan collectionne les tenues sur Pinterest mais achète au coup de coeur. Il veut un blazer rose pâle repéré en vitrine. Il n'a pas de signature. Il a 30 photos de tenues qui lui plaisent, sans les avoir analysées.",
 cards:[
 {t:"order",q:"Remets dans l'ordre la méthode pour construire son style.",it:["Collecte : 30 photos de tenues qui plaisent","Analyse : points communs de coupes, couleurs, matières","Traduction : pièces déjà présentes qui s'en approchent","Ajustement : une acquisition par mois maximum"],w:"Collecte, analyse, traduction, ajustement."},
 {t:"sort",q:"Réponds-tu oui ou non aux trois questions avant l'achat du blazer rose pâle ?",bins:["Pose-toi cette question","Ce n'est pas l'une des trois"],it:[["Est-ce que je le porterais trois fois dans les deux prochaines semaines ?",0],["Est-ce qu'il se marie avec au moins trois pièces que je possède déjà ?",0],["Est-ce que je l'achète pour moi ou pour l'image ?",0],["Est-ce que mes amis auront le même ?",1]],w:"Trois questions : porté trois fois, se marie avec trois pièces, pour moi ou pour l'image."},
 {t:"num",q:"Une acquisition par mois maximum. Combien d'achats par an au maximum ?",a:12,tol:0.1,w:"12 achats par an, tous dans la direction de ton style."},
 {t:"story",q:"Que lui conseilles-tu ?",sc:[{who:"Nolan",txt:"Les règles disent de porter du neutre. Mais j'adore ce rose. Je dois ignorer mon envie ?"}],
  o:["Connais les règles pour choisir lesquelles ignorer","Ignore ton envie : les règles sont absolues et jamais discutables","Achète tout ce qui te plaît, les règles sont inutiles et dépassées","Copie exactement un influenceur pour ne jamais te tromper"],a:0,w:"On devient élégant en connaissant assez les règles pour choisir lesquelles ignorer. Les hommes dont on retient le style ont un élément récurrent."},
 {t:"tf",q:"Une signature de style est un élément récurrent : une couleur, une matière, une pièce ou un accessoire.",a:true,w:"Vrai : choisis le tien et répète-le assez pour qu'il devienne reconnaissable."}
 ]}
]
}
