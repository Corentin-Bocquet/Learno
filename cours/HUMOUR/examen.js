/*EXAMEN*/
{
cases:[
{id:"vanne",t:"Le soir de l'open mic : démonter une vanne",mods:[33],
 ctx:"Mehdi prépare son premier open mic au Café des Arts. Il te lit sa vanne : « Ma grand-mère a 90 ans. Elle marche cinq kilomètres par jour. Maintenant, on ne sait plus où elle est. » Il te lit aussi une anecdote vraie qu'il ne sait pas pourquoi elle ne fait rire personne.",
 cards:[
 {t:"sort",q:"Range chaque phrase de la vanne de Mehdi dans son temps.",bins:["Prémisse","Développement","Chute"],it:[["Ma grand-mère a 90 ans.",0],["Elle marche cinq kilomètres par jour.",1],["Maintenant, on ne sait plus où elle est.",2]],w:"Prémisse : ce que le public croit comprendre. Développement : on installe l'image mentale. Chute : on la remplace par une autre, cohérente rétroactivement."},
 {t:"story",q:"Que lui répondre quand il dit que son anecdote est vraie ?",sc:[{who:"Mehdi",txt:"Mais c'est vraiment arrivé ! Pourquoi personne ne rit ?"}],
  o:["Le vécu donne le matériau, pas la structure : reconstruis pour finir sur le rire", "Il faut la raconter plus lentement pour que le public ressente la vérité", "Il faut ajouter une explication à la fin pour que tout le monde comprenne", "Une histoire vraie est drôle par elle-même, c'est le public qui est mauvais"],a:0,w:"On ne raconte pas ce qui s'est passé, on raconte ce qui fait rire dans ce qui s'est passé."},
 {t:"match",q:"Associe chaque question du test des deux questions à ce qu'elle révèle.",p:[["Qu'est-ce que le public croit ?","La prémisse"],["Qu'est-ce qui est vrai en réalité ?","La chute"],["Les deux réponses sont identiques","Une anecdote, pas une vanne"]],w:"Si tu ne sais pas répondre à la première, tu n'as pas de prémisse. Si la réponse est la même, tu as une anecdote."},
 {t:"num",q:"Une vanne a un nombre fixe de temps : prémisse, développement, chute. Combien de temps au total, sans jamais en avoir plus ni moins ?",a:3,tol:0.1,w:"Trois temps, jamais deux, jamais quatre. Une vanne fait rire quand elle est surprenante et pourtant évidente une seconde plus tard."},
 {t:"tf",q:"Une vanne fait rire parce qu'elle est surprenante, même si le public ne peut pas reconstruire le chemin.",a:false,w:"Faux : si le public ne peut pas reconstruire le chemin, il est perdu et ne rit pas. Surprenante et pourtant évidente une seconde plus tard."}
 ]},
{id:"recit",t:"Le contrat d'ouverture : le récit de soi",mods:[34],
 ctx:"Mehdi veut parler d'un sujet sensible dans son set. Il dit : « Je pense que... ». La salle se crispe. Tu lui proposes d'ouvrir comme Eboué : annoncer qu'il va raconter ce qui lui est arrivé depuis la dernière fois.",
 cards:[
 {t:"match",q:"Associe chaque élément du contrat d'ouverture à ce qu'il pose.",p:[["Un format","Du récit, pas une suite de blagues"],["Une chronologie","Un fil que le public sait suivre"],["Une légitimité","Tout ce qui suit est justifié parce que vécu"]],w:"En une phrase, Eboué pose trois choses : un format, une chronologie, une légitimité. C'est le contrat d'ouverture du spectacle."},
 {t:"story",q:"Pourquoi le « je » désarme-t-il ?",sc:[{who:"Mehdi",txt:"Pourquoi « voilà ce qui m'est arrivé » passe mieux que « je pense que » ?"}],
  o:["Un avis se discute, une expérience ne se discute pas", "Le public croit tout ce que dit l'humoriste sur scène", "Le « je » rend la vanne plus courte et plus efficace", "Le public ne remarque plus le sujet sensible du tout"],a:0,w:"En passant par le « je », l'opinion attaquable devient un témoignage. C'est un blindage, pas une coquetterie."},
 {t:"sort",q:"Dans un récit de scène, que respecte-t-on ?",bins:["Vrai ou vraisemblable","Réécrit pour la chute","Amplifié, jamais inventé de rien"],it:[["Les faits",0],["L'ordre des événements",1],["Les détails comme l'heure, le lieu, le prénom",2]],w:"Récit vrai, agencement faux. Plus le détail est petit et précis, plus l'ensemble passe pour vrai."},
 {t:"order",q:"Remets dans l'ordre la construction du matériau.",it:["Noter dans le carnet ce qui a agacé ou gêné dans la journée","Repérer l'écart entre ce qui devrait être et ce qui est","Réécrire pour que l'information qui fait rire arrive en dernier","Tester devant du public"],w:"La gêne est le meilleur signal : cet écart, c'est déjà la moitié d'une vanne."},
 {t:"tf",q:"Un détail concret (une heure, un lieu, un prénom, un objet) rend l'histoire plus crédible.",a:true,w:"Vrai : le détail concret est ce qui rend l'histoire crédible et fait mieux frapper la chute."}
 ]},
{id:"chute",t:"Finir sur le bon mot : réécrire la chute",mods:[35],
 ctx:"Mehdi lit : « Il a fallu que j'attende une heure au commissariat pour ça. » Il ajoute ensuite : « Enfin voilà, c'était long. » La salle ne rit pas. Tu lui montres la version : « Pour ça, j'ai attendu une heure. Au commissariat. »",
 cards:[
 {t:"tiles",q:"Reconstitue la phrase qui finit sur le mot porteur.",a:["Pour","ça,","j'ai","attendu","une","heure.","Au","commissariat."],dd:["Il","a","fallu","que"],w:"Identifier le mot porteur, puis reconstruire la phrase à l'envers autour de lui. Le mot qui fait rire doit être le dernier mot de la phrase."},
 {t:"story",q:"Que lui dis-tu sur le « Enfin voilà, c'était long » ?",sc:[{who:"Mehdi",txt:"J'ajoute « Enfin voilà » pour que le public comprenne bien."}],
  o:["Coupe-le : ce qui suit la chute la dilue, c'est traîner dessus", "Garde-le : le public a besoin d'une explication pour pouvoir rire", "Répète-le deux fois pour bien insister sur la chute de la phrase", "Dis-le plus vite pour que personne ne le remarque dans la salle"],a:0,w:"Une explication après la chute, une précision, un « enfin voilà » : le rire est déjà en train de mourir."},
 {t:"sort",q:"Quelle famille de chute ?",bins:["Par inversion","Par le concret","Par le détail"],it:[["On retourne le rapport de force ou le rôle attendu",0],["On remplace un concept par un objet trivial",1],["Une précision incongrue qui devient l'essentiel",2],["Le père s'excuse auprès de son fils",0]],w:"Trois familles de chutes : inversion, concret, détail."},
 {t:"order",q:"Remets dans l'ordre le rythme d'une chute réussie.",it:["Un blanc juste avant la chute","La chute, dernier mot de la phrase","Un blanc après la chute","On laisse le rire sortir avant de reprendre"],w:"Sans blanc avant, la chute passe inaperçue. Sans blanc après, le rire n'a pas la place de sortir."},
 {t:"tf",q:"Il est conseillé de précipiter la chute pour ne pas laisser le public réfléchir.",a:false,w:"Faux : une chute a besoin d'un blanc juste avant. Le silence prépare le cerveau à recevoir."}
 ]},
{id:"misdirection",t:"Le sujet grave, la chute triviale : la misdirection",mods:[36],
 ctx:"Mehdi veut parler d'un fait divers. Il prépare : « Et là, attendez, c'est là que c'est drôle... ». Tu lui demandes de trouver la deuxième lecture de la phrase « je l'ai perdue ».",
 cards:[
 {t:"story",q:"Que dis-tu à Mehdi sur son annonce ?",sc:[{who:"Mehdi",txt:"J'annonce « attendez, c'est là que c'est drôle » pour que le public se prépare."}],
  o:["Ne jamais annoncer la structure : le public cesse de croire à la lecture A", "Excellent : le public aime beaucoup être prévenu juste avant la chute", "Annonce-le seulement au début du spectacle, jamais en cours de route", "Annonce-le deux fois de suite pour être sûr de l'effet sur la salle"],a:0,w:"Le ton doit rester sincère jusqu'au dernier mot. Les marqueurs trahissent la misdirection."},
 {t:"sort",q:"Lecture A ou lecture B de « je l'ai perdue » ?",bins:["Lecture A, installée","Lecture B, révélée"],it:[["J'ai perdu ma clé",0],["J'ai perdu mon pari",0],["J'ai perdu ma femme au supermarché, et je n'ai pas cherché",1],["J'ai perdu ma voix",0]],w:"On installe une lecture A plausible et confortable. La chute révèle une lecture B, vraie depuis le début."},
 {t:"match",q:"Associe chaque élément à son rôle.",p:[["Sujet grave","Fait monter la tension"],["Chute triviale","Offre une porte de sortie au public"],["Décalage d'échelle","Source réelle du rire"]],w:"Le rire ne vient pas de la gravité, il vient du décalage d'échelle. La vanne ne se moque pas du drame, elle se moque du quotidien qui continue à côté."},
 {t:"order",q:"Remets dans l'ordre la construction d'une misdirection.",it:["Choisir une phrase banale à deux lectures possibles","Installer la lecture A, plausible","Monter la tension sur un sujet lourd","Faire tomber la chute sur un détail domestique"],w:"Le stock de vannes commence par la recherche de la deuxième lecture d'une phrase banale."},
 {t:"tf",q:"Plus la tension monte, plus le public a besoin d'une porte de sortie : la chute triviale en est une.",a:true,w:"Vrai : c'est aussi ce qui rend la vanne défendable."}
 ]},
{id:"tag",t:"Ne pas gâcher un bon setup : le tag et la règle de trois",mods:[37],
 ctx:"Mehdi a un setup de deux minutes sur son colocataire, une seule chute. Il tente ensuite trois tags, dont le troisième est plus faible que le précédent. Il fait aussi une liste de quatre éléments : « un café, un croissant, un journal, un cheval ».",
 cards:[
 {t:"order",q:"Remets dans l'ordre la structure avec tags.",it:["Setup","Chute 1","Tag 1","Tag 2","Sortie"],w:"Chaque tag est plus court et plus fort que le précédent."},
 {t:"story",q:"Que lui dis-tu sur son troisième tag, plus faible ?",sc:[{who:"Mehdi",txt:"Mon troisième tag est moins fort, mais je le garde pour finir sur du volume."}],
  o:["Coupe-le : un tag plus faible fait s'effondrer la série", "Garde-le : une série de tags plus longue est toujours meilleure que l'autre", "Place-le au début pour s'échauffer avant les tags les plus forts", "Garde-le, mais dis-le beaucoup plus lentement que les autres tags"],a:0,w:"Dès qu'un tag est plus faible, on s'arrête."},
 {t:"sort",q:"Dans la règle de trois, que fait chaque élément ?",bins:["Normal","Normal, confirme le motif","Rupture"],it:[["Élément 1",0],["Élément 2",1],["Élément 3",2]],w:"Deux éléments installent un motif, le troisième le casse."},
 {t:"story",q:"Que dis-tu de sa liste de quatre éléments ?",sc:[{who:"Mehdi",txt:"Un café, un croissant, un journal, un cheval. Quatre, c'est mieux que trois !"}],
  o:["Trois éléments, pas quatre : au quatrième, le public décroche", "Quatre éléments donnent deux chutes pour le prix d'une seule liste", "Cinq éléments sont encore mieux, l'escalade se renforce à chaque pas", "Garde quatre éléments si le dernier est le plus long de la liste"],a:0,w:"Trois éléments, pas quatre. C'est le minimum nécessaire pour qu'un cerveau détecte une régularité."},
 {t:"tf",q:"Une escalade fonctionne seulement si chaque marche reste logiquement dérivée de la précédente.",a:true,w:"Vrai : un saut trop grand, et le public décroche."}
 ]},
{id:"callback",t:"Rappeler pour récompenser : le callback",mods:[38],
 ctx:"Mehdi a fait rire la salle avec « mon colocataire Gérard » à la minute 2. À la minute 18, il veut le rappeler. Il hésite entre le rappeler à la minute 5, ou en refaisant toute l'explication.",
 cards:[
 {t:"sort",q:"Cette condition du callback est-elle respectée ?",bins:["Respectée","Pas respectée"],it:[["L'élément rappelé avait déjà fait rire",0],["On le rappelle 30 secondes après la première fois",1],["Le rappel tient en un mot",0],["Le rappel reformule toute l'histoire",1]],w:"Trois conditions : il a déjà fait rire, assez de distance pour qu'on l'ait presque oublié, rappel bref."},
 {t:"story",q:"Que lui conseilles-tu ?",sc:[{who:"Mehdi",txt:"Je rappelle Gérard à la minute 5, ou à la minute 18 ?"}],
  o:["À la minute 18, en un mot : on l'a presque oublié", "À la minute 5 : plus c'est près, plus le rire du rappel est fort", "À la minute 18, avec toute l'histoire pour que tout le monde comprenne", "Jamais : un callback est de la paresse, le public n'est pas dupe"],a:0,w:"Le rire du callback est hors de proportion avec la vanne elle-même, parce qu'il récompense le public d'avoir suivi."},
 {t:"match",q:"Associe chaque raison à ce qu'elle apporte.",p:[["Complicité","On a une histoire commune, vous et moi"],["Construction","Le spectacle paraît écrit, donc maîtrisé"],["Aucun coût de setup","Le travail a déjà été fait"]],w:"Pourquoi le callback marche si fort : une complicité, une impression de construction, un travail de setup déjà fait."},
 {t:"num",q:"Mehdi pose 4 éléments dans son spectacle. Il rappelle 2 d'entre eux en callback. Quel pourcentage est rappelé ?",a:50,tol:0.5,un:" %",w:"2 / 4 = 50 %. Un callback de clôture renvoie à la toute première minute et transforme les sketchs en une seule histoire."},
 {t:"tf",q:"Le callback de clôture, qui renvoie à la toute première minute, transforme une suite de sketchs en une seule histoire.",a:true,w:"Vrai : c'est presque toujours ce que le public raconte en sortant."}
 ]},
{id:"autoderision",t:"Payer d'abord, viser ensuite : l'auto-dérision",mods:[39],
 ctx:"Mehdi veut se moquer de ses collègues. Tu lui demandes de commencer par lui-même. Il hésite entre « je travaille trop » et « j'ai peur des araignées au point de dormir dehors ».",
 cards:[
 {t:"sort",q:"Faut-il viser cela chez soi ?",bins:["Bonne cible","Mauvaise cible"],it:[["Ce que le public voit déjà (physique, âge, accent)",0],["Ses échecs",0],["Ses réussites déguisées en échecs (« je travaille trop »)",1],["Ses lâchetés : la peur, la petitesse, la mauvaise foi",0]],w:"Les lâchetés sont le gisement le plus riche, parce que tout le monde s'y reconnaît."},
 {t:"story",q:"Pourquoi commencer par soi ?",sc:[{who:"Mehdi",txt:"Pourquoi je dois me moquer de moi avant de viser mes collègues ?"}],
  o:["Un acompte versé au public : il t'autorise à aller plus haut", "C'est de la modestie : le public aime beaucoup les gens modestes", "C'est une obligation légale pour tous les humoristes professionnels", "C'est pour éviter que les collègues viennent voir le spectacle"],a:0,w:"Auto-dérision = acompte versé au public. Plus l'acompte est sincère, plus le crédit est large."},
 {t:"story",q:"Que lui dis-tu quand il enchaîne dix minutes sur ses défauts ?",sc:[{who:"Mehdi",txt:"Je me déteste, je suis nul, tout le monde me le dit."}],
  o:["Elle devient plainte : on rit d'un homme lucide, pas d'un qui se déteste", "C'est parfait : plus tu te rabaisses longtemps, plus la salle rit de toi", "Continue sur le même ton jusqu'à la fin du spectacle, sans changer", "Cherche à toucher le public avec la pitié, c'est plus efficace encore"],a:0,w:"La différence tient au ton : un constat, pas une confession."},
 {t:"match",q:"Associe chaque ton à son effet.",p:[["Un constat lucide","Le public rit"],["Une confession pleurnicharde","Le public décroche"],["Un acompte sincère","Un crédit large pour la suite"]],w:"L'auto-dérision cesse de fonctionner quand elle devient plainte."},
 {t:"tf",q:"Dire « je travaille trop » est une bonne auto-dérision, car c'est un défaut.",a:false,w:"Faux : c'est une réussite déguisée en échec, et personne n'en rit."}
 ]},
{id:"sensible",t:"Rire de quoi, avec qui, contre qui : le sujet sensible",mods:[40],
 ctx:"Mehdi veut une vanne sur un sujet lourd. Sa première version se moque de personnes qui subissent déjà. Tu lui proposes de viser le discours et non les victimes, et de désamorcer en nommant la gêne à voix haute.",
 cards:[
 {t:"sort",q:"Vise-t-on vers le haut ou vers le bas ?",bins:["Vers le haut","Vers le bas"],it:[["La puissance et les institutions",0],["Soi-même",0],["Ceux qui subissent déjà",1],["Le ministre qui se contredit",0]],w:"Viser vers le haut fait rire une salle, viser vers le bas la divise."},
 {t:"story",q:"Que lui conseilles-tu sur l'angle ?",sc:[{who:"Mehdi",txt:"Le sujet est tragique, aucune vanne n'est possible, non ?"}],
  o:["Un sujet n'est jamais drôle en soi : cherche l'angle, le ridicule du discours", "Tu as raison : abandonne tous les sujets tragiques pour toujours, par prudence", "Prends le sujet de front, sans angle particulier, c'est ce qu'on attend de toi", "Parle de toi seulement, sans jamais toucher au sujet tragique du tout"],a:0,w:"La cible devient le discours, pas les victimes."},
 {t:"match",q:"Associe chaque technique de désamorçage à son principe.",p:[["Annoncer qu'on va aller loin","Le public consent à l'avance"],["Rire de soi juste avant","Gagner le droit de continuer"],["Nommer la gêne à voix haute","Le malaise partagé devient un rire"]],w:"Trois techniques de désamorçage : annoncer, rire de soi, nommer la gêne à voix haute. Le public consent et le malaise devient un rire."},
 {t:"story",q:"Que lui dis-tu du personnage scénique ?",sc:[{who:"Mehdi",txt:"Si je dis un truc moche, on va croire que c'est moi."}],
  o:["Sur scène, tu joues une version amplifiée : la cible, c'est le personnage", "Dans ce cas, joue-toi sans aucun personnage, en restant très naturel", "Annonce que ce n'est pas toi après chaque vanne pour éviter les ennuis", "Évite les sujets où un personnage pourrait se montrer menteur ou lâche"],a:0,w:"Ce personnage peut dire des choses que l'auteur ne dirait pas."},
 {t:"tf",q:"La vraie question n'est pas « peut-on rire de ce sujet », mais « avec qui je ris, et contre qui ».",a:true,w:"Vrai : la même phrase change de sens selon la cible réelle de la moquerie."}
 ]},
{id:"rythme",t:"Couper, respirer, regarder la salle : rythme et adresse",mods:[41],
 ctx:"Le premier jet de Mehdi fait 250 mots. Il enchaîne ses vannes sans silence, parle par-dessus le rire et reste collé au pupitre. Une vanne tombe à plat, la salle se tait.",
 cards:[
 {t:"num",q:"Un premier jet perd 30 à 40 % de ses mots. Sur 250 mots, combien de mots restent au minimum, avec 40 % de coupe ?",a:150,tol:1,un:" mots",w:"250 x 0,6 = 150 mots. Avec 30 % de coupe : 175 mots. Couper tout ce qui n'est ni nécessaire ni drôle."},
 {t:"sort",q:"À quel moment fait-on ce silence ?",bins:["Avant la chute","Après la chute","Pendant le rire"],it:[["On prépare, on crée l'attente",0],["On laisse le rire sortir",1],["On ne parle jamais par-dessus",2]],w:"Parler par-dessus le rire, c'est perdre la vanne suivante : personne ne l'entendra."},
 {t:"story",q:"Que fait Mehdi quand une vanne tombe à plat ?",sc:[{who:"Mehdi",txt:"La salle s'est tue après ma vanne. Je continue comme si de rien n'était ?"}],
  o:["Prends un spectateur à partie : l'adresse directe relance", "Excuse-toi plusieurs fois pour la vanne ratée, avec le sourire", "Répète la vanne plus fort pour qu'elle finisse par marcher", "Quitte la scène quelques secondes pour reprendre ton souffle ici"],a:0,w:"L'adresse directe est aussi une assurance : si une vanne tombe à plat, elle relance immédiatement."},
 {t:"match",q:"Associe chaque geste à son effet.",p:[["Regard qui balaie la salle","Installe l'autorité"],["Immobilité pendant la chute","Concentre l'attention sur le texte"],["Mouvement","Sert la mise en scène, jamais le remplissage"]],w:"Le corps accompagne le texte, il ne le remplace pas."},
 {t:"tf",q:"Une vanne plus longue est toujours meilleure, car elle laisse plus de place au développement.",a:false,w:"Faux : une vanne trop longue meurt. On coupe ce qui n'est ni nécessaire à la compréhension ni drôle."}
 ]},
{id:"set",t:"Construire et roder un set de vingt minutes",mods:[42],
 ctx:"Mehdi a dix vannes fortes en vrac. Il veut ouvrir par sa meilleure vanne. Il la teste une fois, sans enregistrer. Une vanne ne marche pas trois fois de suite devant trois publics différents.",
 cards:[
 {t:"order",q:"Remets dans l'ordre la courbe d'intensité d'un set.",it:["Ouverture : fort et facile, pour installer la confiance","Milieu : les blocs les plus construits et risqués","Fin : le bloc le plus personnel","Callback de clôture"],w:"On ne met jamais sa meilleure vanne en premier, ni en dernier tout seul."},
 {t:"story",q:"Que lui dis-tu sur l'ouverture ?",sc:[{who:"Mehdi",txt:"Je commence par ma meilleure vanne, comme ça j'assure."}],
  o:["Non : le reste paraîtrait faible, ouvre fort et facile pour la confiance", "Oui : une salle se gagne dans les dix premières secondes, pas après", "Oui : et termine par la plus faible pour laisser un espace libre", "Non : commence plutôt par un long silence pour calmer toute la salle"],a:0,w:"La clôture doit surtout être émotionnelle, pas juste drôle."},
 {t:"story",q:"Que fait-il d'une vanne qui ne marche pas trois fois de suite devant trois publics ?",sc:[{who:"Mehdi",txt:"Le public n'a pas compris ma vanne, trois fois de suite."}],
  o:["Coupe-la : le public n'a pas tort, garde le sujet, change l'angle", "Garde-la : le public finira par comprendre ce que tu voulais dire", "Explique-la plus longuement à chaque passage, jusqu'à ce que ça marche", "Joue-la dans un autre ordre sans rien changer d'autre dans la vanne"],a:0,w:"On coupe, on garde le sujet, on cherche un autre angle."},
 {t:"multi",q:"Coche les bons gestes de rodage.",o:["Écrire vite, sans juger","Tester devant du vrai public en petit format","Enregistrer et réécouter le lendemain","Compter les rires et couper ce qui ne déclenche rien deux fois de suite","Changer la structure et garder les mots"],a:[0,1,2,3],w:"On garde la structure et on change les mots, pas l'inverse."},
 {t:"num",q:"Un spectacle d'une heure et demie représente plus de cent passages en rodage. Mehdi fait 3 passages par semaine. En combien de semaines atteint-il 100 passages (arrondi à l'entier supérieur) ?",a:34,tol:0.5,un:" semaines",w:"100 / 3 = 33,3, soit 34 semaines. L'écriture ne se fait pas à la table, elle se fait sur scène."}
 ]}
]
}
