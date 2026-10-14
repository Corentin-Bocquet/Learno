# Learno : consignes permanentes

Ce fichier est la mémoire du projet. Il s'applique à toute session qui travaille sur Learno.
Il reprend les demandes de Corentin pour tous les futurs cours (les anciens cours ne sont pas modifiés).

## Règles d'or

- Ne jamais modifier les cours existants ni le design de la plateforme sans demande explicite.
  On ajoute, on ne réécrit pas. Les nouvelles fonctions passent par des enveloppes autour des
  fonctions existantes ou par des branches optionnelles activées par un drapeau de cours.
- Aucun tiret cadratin (le caractère U+2014) nulle part : ni dans les textes, ni dans le code, ni dans les commentaires.
- Aucun emoji littéral dans un `<script>` placé après le script qui appelle `boot()`.
  `startEmojiWatch()` réécrit les emoji de tout texte ajouté au document, y compris le contenu
  d'un script pas encore exécuté : le script est vidé et ne s'exécute jamais, sans erreur.
  Écrire les emoji sous la forme `\u{1F48E}`. Le test `tests/tpatri.js` le vérifie.

## Objectif de chaque cours (demande de Corentin)

À la fin d'un cours, l'apprenant doit être un crack, presque un professionnel du sujet : il connaît
tout, il a tout compris, et il a revu chaque notion au moins sept fois.
- **Toutes les notions sont vues en profondeur.** Chaque mot, chaque notion présente dans la source
  (mind map, podcast, vidéo, notes), même cité sans explication, est défini, expliqué, illustré et
  entraîné. On liste les notions dans `cours/<CID>/notions.txt` et le test `tests/tcours.js` vérifie
  que chacune apparaît dans un guide et dans plusieurs exercices.
- **Sept expositions par notion :** le guide, plusieurs exercices dans son module, des exercices de
  rappel dans les modules suivants, les rappels automatiques (`mix`), et un module final de synthèse.
- **La pratique d'abord.** Plus de cas pratiques que de théorie : situations réelles, conversations,
  décisions à prendre, calculs, schémas. Pour les sports, des schémas SVG (cibles, positions, phases).
- **Un retour à chaque réponse.** L'explication `w` explique pourquoi, rassure quand c'est utile
  (surtout pour les cours de développement personnel) et redonne le moyen mnémotechnique.
- **Recherches approfondies** avant d'écrire, sources récentes, chiffres vérifiés et datés.
- **Sources en ligne** (podcast, YouTube) : l'accès direct est bloqué dans le conteneur ; passer par
  Firecrawl via Composio (page YouTube complète ou youtubetotranscript.com) pour récupérer la transcription.

## Les noms des cours

Un nom doit dire en deux secondes de quoi parle le cours ET donner envie de cliquer. Format conseillé :
« Sujet : promesse concrète » (exemple : « Transmission du patrimoine : qui hérite, qui paie »).
Si un nom existant est flou ou ne donne pas envie, on peut le renommer (autorisé par Corentin).

## Méthode pour créer un cours à partir de notes

1. Extraire toute la matière (une mind map MindNode est une archive zip contenant un plist binaire).
2. Vérifier chaque règle et chaque chiffre sur des sources à jour, en datant la vérification.
   Les notes de cours contiennent des erreurs : on ne les recopie jamais en silence.
3. Signaler chaque erreur des notes dans le guide avec un encadré `<div class="gtrap">`, en expliquant
   ce qui est faux et la règle juste. Quand les notes donnent une règle périmée, demander à Corentin
   quelle règle retenir (pour le Dutreil, il a choisi : uniquement la règle en vigueur).
4. Tout ce qui figure dans les notes doit se retrouver dans le cours, puis compléter avec ce qui manque
   pour que le cours soit complet pour l'évaluation.
5. Si les notes annoncent le périmètre de l'évaluation, l'écrire dans le dernier guide.

## Structure d'un cours

- Chaque module compte exactement 32 exercices, donc 8 leçons de 4 questions neuves.
- Le cours porte `mix:true` dans `COURSES` : chaque leçon de 7 questions contient 4 questions neuves,
  2 rappels tirés des modules précédents (les plus oubliés d'abord) et 1 rappel du module en cours.
- Le cours porte une catégorie `cat` : `ecole`, `jeux`, `diver`, `style`, `livres`, `sport`, `perso` (liste `CATS`).
- Les sources de chaque cours vivent dans `cours/<CID>/uNNN.js` (un fichier par module : le guide puis
  les exercices). `python3 tools/assemble.py` les injecte dans `index.html`, dans un bloc
  `<!-- COURS:<CID>:DEBUT -->` placé avant le moteur. On n'édite jamais ce bloc à la main.
  `node tools/longueurs.js cours/<CID>/uNNN.js` affiche la longueur des propositions pour traquer le biais.
- Identifiants d'unités à la suite des existants, identifiants d'exercices préfixés et uniques.

## Le guide de chaque module : faire vivre la notion

On retient ce qu'on a vécu. Chaque guide doit contenir :
- au moins une mise en situation `<div class="gstory">` avec des personnages récurrents du cours
  (une famille, un chef d'entreprise, un couple...), des lieux et des détails concrets qui accrochent la mémoire ;
- au moins un moyen mnémotechnique `<div class="gmnemo">` (acronyme, phrase, image, formule mémo) ;
- les tableaux et formules utiles (`<table>`, `<div class="formula">`) ;
- les pièges des notes (`<div class="gtrap">`) ;
- ce qu'il faut savoir faire en examen.

## Les exercices : interactifs, réalistes, difficiles à deviner

- Varier les formats dans chaque module (au moins 8 formats différents) et choisir le format qui colle
  à la notion : `story` (conversation avec un client, au moins 4 par module), `sort` (classer dans des
  cases), `multi` (cocher toutes les bonnes réponses), `slider` (taux, âges, durées, montants), `num`
  (calcul chiffré), `match` (paires), `order` (étapes), `tiles` (reconstituer une phrase avec des mots
  pièges), `fill` (mot manquant), `tf`, `mcq` (8 QCM classiques maximum par module).
- Des cas pratiques proches de la vraie vie : énoncé complet dans `ctx`, dialogue client dans `sc`,
  on doit se sentir en train d'exercer le métier.
- Toutes les questions sont différentes, aucune répétition entre les leçons d'un même module.
- Les mauvaises réponses sont plausibles et de même longueur que la bonne. La bonne réponse ne doit pas
  être la plus longue plus souvent que le hasard : entre 12 % et 34 % des questions à choix, et un ratio
  moyen de longueur inférieur à 1,12. Le test `tests/tpatri.js` le contrôle ; le reproduire pour chaque
  nouveau cours.
- Chaque exercice a une explication `w` qui rappelle la règle et, si possible, le moyen mnémotechnique.
- Vrai ou faux équilibré : entre 35 % et 65 % d'affirmations vraies par cours (demande du 24/09/2026).
  Le test `tests/tarcade.js` contrôle ce point et le biais de longueur sur tous les cours.
- Une leçon ne pose jamais de question sur une leçon pas encore faite (enveloppe `lessonGate` de `arcade.js`) :
  les rappels viennent des leçons précédentes du module ou des modules précédents, jamais de plus loin.
  Les jeux (Éclair, Vrai ou faux, Frise, Boss, Duel) ne piochent que dans ce qui a déjà été étudié.

## Design Arcade (choix de Corentin, 24/09/2026)

- Base visuelle : direction « Arcade » (fond marine #141432, titres en Baloo 2, grosses cartes colorées),
  enrichie de « Duo Jour » (modules en cartes, carte Reprendre, erreur expliquée) et « Mondes »
  (bulle Commencer +XP, fin de leçon XP / précision / temps, ligue et trophées).
- Sources : `design/arcade/arcade.css` et `design/arcade/arcade.js`. `python3 tools/design.py` les injecte
  à la fin de `index.html`, dans le bloc `<!-- DESIGN:ARCADE:DEBUT -->`. On n'édite jamais ce bloc à la main.
- Tout passe par des enveloppes (renderPath, doCheck, finish, renderLeague...) : aucun cours ni règle de jeu
  n'est modifié. Les mascottes (Koala et Diable) ne sont jamais redessinées, on choisit seulement leurs poses.
- Images générées (coffres, potions, gel) : `design/assets/`, prompts dans `design/assets/PROMPTS_IMAGES.md`.
- Nouveaux jeux construits sur les exercices existants : Éclair (paires), Vrai ou faux express, Frise
  (remise en ordre), Boss du module (le Diable), Duel de ligue. Test : `tests/tarcade.js`.
- iPhone (demande du 24/09/2026) : rien ne passe sous l'encoche ni sous l'heure. Tout écran plein
  (barre du haut, croix de leçon, modales, jeux) respecte `env(safe-area-inset-top)` ; en bas, la marge
  suit `env(safe-area-inset-bottom)` sans la doubler. Vérifier chaque nouvel écran à 390 x 844.
- Barre du bas : cinq cases au maximum (Jouer, Réviser, Ligue, Boutique, Plus), icônes seules sans texte, en verre liquide
  flottant. Tout autre onglet va dans Plus. Profil et Réviser sont rangés en sections repliables :
  on garde toutes les fonctions, on évite les longs défilements.
- « Guide » s'appelle « Leçon » partout. Une leçon jamais faite s'ouvre sur son cours (la partie du guide
  la plus proche de ses questions), avec un bouton Passer, puis le quiz.
- Icônes : jeu maison « verre liquide » (`GL` dans `design/arcade/arcade.js`) : glyphe clair sur tuile de verre
  colorée. Toute nouvelle icône suit ce style ; pas d'emoji ni d'icône plate dans l'interface Arcade.
- Catégories de cours : l'utilisateur peut les renommer, en ajouter, supprimer une catégorie vide et glisser
  un cours d'une catégorie à l'autre (Mes cours, Organiser). Les réglages vivent dans `S.cats`.
- Icônes de cours : une icône verre liquide dessinée pour chaque cours (`CB` dans `arcade.js`), jamais l'icône « page »
  par défaut. Tout nouveau cours reçoit la sienne (le test Arcade le vérifie). Catégories : `CATG`.
- Divisions de ligue : trophées en métal coloré (`trophySVG`), plus ornés à chaque palier.
- Coffres : chaque ouverture joue une animation (`arcChestFX`) aux couleurs du coffre (matin, soir, légendaire, quête).
- Série : l'affichage retombe à 0 après un vrai jour manqué ; un jour sauvé par un gel est noté (`S.gelDays`) et montré.
- Le masque de lancement (`DESIGN:ARCADE:TETE`, injecté dans `<head>` par `tools/design.py`) cache
  l'ancien design tant que la couche Arcade n'est pas installée.

## Couche confort (demandes du 01/10/2026)

Source : `design/arcade/extras.js` (injectée par `tools/design.py` après `arcade.js`), test `tests/tconfort.js`.
- **Mots du métier** : tout terme qu'un non-initié ne connaît pas (rente viagère, usufruit, spread...) a une
  entrée dans `design/arcade/glossaire.js` : explication simple + exemple concret, limitée aux cours concernés (`c`).
  Il est souligné dans la leçon, l'énoncé et la correction, un toucher ouvre la bulle « En clair ».
  Chaque nouveau cours ajoute ses termes au glossaire.
- **Plusieurs réponses justes** : les formules (`eq`, ou `tiles` contenant un opérateur) sont comparées par leur
  valeur (a + b = b + a, côtés inversés). Pour une phrase `tiles` qui admet une autre formulation juste, ajouter
  `alts:["autre phrase juste"]` à l'exercice. Les nombres arrondis correctement, écrits « 1 234,5 » ou sous forme
  de calcul sont acceptés ; `alt:[...]` sur un `num` ajoute d'autres valeurs justes.
- **Cas pratiques visuels** : l'énoncé `ctx` s'affiche en fiche (une ligne par phrase, « Libellé : valeur » en
  tableau, chiffres en évidence). Un champ optionnel `tab:[["Bien","Valeur"],["Maison","400 000 €"]]` affiche un
  vrai tableau sous l'énoncé : à utiliser dès qu'un cas compare plusieurs chiffres.
- **Corrections** : jamais de « A → B · C → D ». Paires en tableau, classement par case, ordre en liste numérotée.
  Dans les formules des leçons, pas de flèche ASCII « -> » : elle est redessinée, mais préférer une phrase.
- **Épreuve légendaire obligatoire** : le module suivant ne s'ouvre qu'avec la couronne du module précédent
  (un module déjà commencé reste ouvert). « Continuer » mène à l'épreuve quand elle est due.
- **Leçon avant chaque quiz**, y compris quand on enchaîne depuis la fin d'une leçon (`chainNext`).
- **Calculatrice** : multiplication implicite 2(3+4), puissance, carré, racine, ln, log, eˣ, %, π, Ans.
- **Boutique** : potions x1,5 (30, 45 min), x2 (15, 30, 45 min), x3 (10, 20, 30, 45 min) au tarif unique
  prix = tarif x (multiplicateur - 1) x minutes, tarif 4, 6,5 et 8 gemmes la minute de bonus (02/10/2026) :
  une potion plus forte ou plus longue coûte toujours plus cher. Jauge et minuteur posés sur le bas de la
  barre du haut. Gel de série : 150 gemmes.
- **Cases à cocher** (`multi`, 02/10/2026) : jamais « toujours une seule fausse ». `design/arcade/multi_faux.js`
  ajoute au moins une affirmation fausse à chaque exercice et chaque affichage tire un nombre variable de
  justes et de fausses (de zéro à trois fausses). Tout nouvel exercice `multi` doit y avoir son entrée, et
  viser des cours avec 1 à 3 fausses et 1 à 4 justes.
- **Situation du module** : la première leçon d'un module affiche la mise en situation (`gstory`) du guide
  avant le quiz. Chaque guide doit donc commencer son histoire dans un `gstory` compréhensible seul.
- **Nombres** : espace des milliers (espace fine insécable) dans la saisie du quiz, la calculatrice et les
  textes des questions (1 234 567,5). Dans les sources des cours, écrire déjà « 1 500 € » et non « 1500 € ».
- **iPhone** : pas de zoom au double toucher ni à la saisie (`touch-action`, `maximum-scale=1`) ; en mode
  application, la hauteur suit l'écran entier (pas de bande morte en bas). Chargement : rien si c'est rapide,
  sinon une animation Arcade après 0,3 s ; l'ancien design n'apparaît jamais.

## Télécommande (demande du 12/10/2026)

Le PC branché en HDMI sur la télé affiche Learno, le téléphone le pilote. Source : `design/arcade/telecommande.js`
et `telecommande.css` (injectés par `tools/design.py`), test `tests/ttele.js`.
- Transport : Supabase Realtime (broadcast) sur le canal `learno-tele-<CODE>`, sans table ni compte. Code de 6 caractères tiré au hasard sur le PC, QR code maison (versions 1 à 6, vérifié par décodage).
- Entrées : Plus (téléphone), barre latérale (PC). Le lien `?tele=CODE` ouvre directement la télécommande.
- Téléphone : pavé tactile, croix directionnelle (navigation spatiale), boutons A B C D pour les QCM, pavé numérique, défilement, Retour, Accueil. Pas de glisser-déposer. **Gestes du pavé** : un doigt qui glisse fait défiler la télé (sens naturel), rester appuyé puis glisser déplace le curseur, un toucher rapide clique, un appui long sans bouger n'envoie rien. En mode quiz, la télé réduit son zoom (`fit()` dans `telequiz.js`) jusqu'à ce que la question et toutes les réponses tiennent à l'écran sans défiler. **Plein écran télé** : dès que le téléphone est connecté (`body.tele-on`), tout est agrandi (`#shell` en zoom `--tzs`) et la colonne centrale prend toute la largeur ; en quiz (`body.tele-tv`) le menu et le rail sont masqués, la question prend toute la largeur et les réponses sont en deux colonnes. L'écran de la télé est horizontal : ne jamais limiter la largeur utile à 760 px en mode télécommande.
- **Mode quiz (Kahoot, demande du 12/10/2026)** : `design/arcade/telequiz.js` et `telequiz.css`. Automatique dès qu'une question s'affiche avec le téléphone connecté, jamais de question à poser. Télé : question en grand (`body.tele-tv`, zoom `--tz`), réponses en tuiles de couleur. Téléphone : seulement les boutons du format (QCM, vrai ou faux, cases, curseur, calcul, phrase, paires, classement, ordre), un toucher répond et corrige les choix simples. Le PC lit la question affichée (`A.ex`, DOM) et rejoue les gestes sur le vrai moteur : aucun exercice n'est réécrit. Formats visuels (plateau, courbe, poker...) : télécommande classique, bouton Curseur pour y revenir. Tout nouveau format d'exercice doit être ajouté à `spec()` et `hooks.msg`, sinon il reste en télécommande classique. **Calculatrice** : sur les questions de calcul et les formules, un bouton Calculatrice ouvre celle de la télé (`openCalc`) et le téléphone affiche son clavier complet (touches lues dans `#calc-wrap .ckey`), l'expression, le résultat, Fermer et Utiliser comme réponse. Aucun curseur nécessaire.

- **Quiz à plusieurs (Kahoot, demande du 12/10/2026)** : `design/arcade/telearena.js` et `telearena.css`, test `tests/ttele2.js`. Désactivé par défaut : dans la fenêtre de la télécommande, un réglage « Joueurs » (1 = solo, rien ne change, jamais de question posée). À partir de 2 : salon sur la télé (code, QR code, prénoms), compte à rebours quand tout le monde est là, 10 questions à choix (vrai ou faux, QCM) tirées de ce que le cours actuel a déjà fait étudier (`arcPool`), temps réglable 15, 20 ou 30 s, points selon la vitesse, classement après chaque question, podium. Les téléphones n'affichent que les boutons. Aucun point d'XP ni de gemme n'est touché. Le PC fait autorité : les téléphones envoient seulement `join`, `ans`, `go`. Une vue de téléphone ne doit jamais se reconstruire tant qu'elle ne change pas pour ce joueur (un toucher en cours serait perdu).

## Rédaction des leçons (guides) : visuel d'abord

Demande de Corentin : une leçon doit se lire comme une fiche, pas comme un bloc de texte.
- Une partie `<h3>` par idée, 60 à 120 mots maximum par partie ; une phrase par idée.
- Préférer listes, tableaux, formules et schémas SVG aux paragraphes ; un paragraphe ne dépasse pas trois lignes sur iPhone.
- Commencer chaque guide par « Ce que tu dois savoir faire » (affiché en objectifs en haut de la leçon).
- Mettre en gras le mot clé de chaque phrase importante (il est surligné à l'écran).
- Des phrases complètes, jamais des fragments collés par des points-virgules (demande du 24/09/2026).
  Aucun « ; » dans la prose des leçons, cellules de tableau et listes comprises : on écrit deux phrases.
  Seules exceptions : une citation exacte entre guillemets et les formules (`<div class="formula">`).
  Le test `tests/tarcade.js` le vérifie sur tous les cours.

## Examen blanc

Trois niveaux de difficulté avant le format : Facile 10/20/30 questions, Moyen 15/40/60, Difficile 30/60/100,
avec les mêmes durées de 8, 20 et 35 minutes (choix de Corentin).

## Gemmes, ligue, serveur

- Boutique : potions d'XP (voir « Couche confort » pour les durées et le tarif), coffres du matin et du soir,
  pari de série, gels et coeurs.
- Ligue en ligne : table Supabase `learno_league` (SQL dans `supabase/learno_league.sql`, déjà appliqué).
  Les vrais joueurs remplacent des personnages fictifs.
- Supabase est accessible via le connecteur Composio de Corentin (projet `nrhkijgxbxslczutjrev`).
  Tables : `learno_state` (progression), `learno_league` (classement). Jamais de clé secrète dans le dépôt.

## Tests

Avant tout envoi : `tests/ci_smoke.js`, `tests/tall.js` pour chaque cours (`CID=...`), puis
`tbackup tcloud tui tmissions tpratique tpro tmasc tpatri tarcade tconfort`. Ajouter chaque nouveau cours dans
`.github/workflows/verification.yml` et relever les seuils de `tests/ci_smoke.js`.

## Publication : fusion automatique dans main (demande de Corentin, 24/09/2026)

Tout travail terminé est fusionné dans `main` automatiquement, sans redemander l'accord :
1. lancer les tests ci-dessus en local ;
2. committer et pousser sur la branche de travail, ouvrir la PR (ou réutiliser celle qui est ouverte) ;
3. attendre que la CI « tests » soit verte sur le dernier commit et qu'il n'y ait aucun conflit ;
4. passer la PR en « prête » et la fusionner dans `main` (méthode merge), puis arrêter la surveillance.

Si la CI est rouge, on corrige et on repousse ; on ne fusionne jamais une PR rouge ou en conflit.
Après une fusion, tout nouveau travail repart de `main` à jour, sur une nouvelle PR.

## Cas pratiques en plusieurs cartes (demande du 12/10/2026)

Un cas pratique se déroule étape par étape sur plusieurs cartes d'une même leçon : chaque carte porte
`cas:"<module>-<nom>"`, `k:1, 2, 3...` et `ck:"Cas pratique · étape 2 sur 4"`, avec un `ctx` qui redonne les
données (la carte peut tomber seule en révision). `design/arcade/extras.js` (section 14) remet les étapes d'un
même cas à la suite et dans l'ordre. Au moins la moitié des leçons d'un cours de type examen sont des cas pratiques
en face à face avec un client.

## Examen pratique (demande du 13/10/2026)

Chaque cours a un examen pratique final, fait uniquement de cas pratiques et d'exercices inspirés des notes, des TD et des
mind maps (pas des contenus approfondis ajoutés au-delà). Il est distinct de l'examen blanc (quiz et théorie).
Sources : `design/arcade/exprat.js` et `exprat.css` (injectés par `tools/design.py`), banques `cours/<CID>/examen.js`
(injectées par `tools/assemble.py` dans `window.PEXAM[CID]`), test `tests/texprat.js`.
- **Accès** : bouton en fin de parcours du cours et carte dans l'onglet Examen. Jouable à tout moment, sans avoir fini
  les modules. Durées : 15, 30, 60 ou 90 minutes (`DUREES`), les cas sont tirés en privilégiant ceux vus le moins
  récemment (`S.pexSeen`).
- **Indépendant du mode express** : la banque `PEXAM` est séparée de `EXOS`, donc le tirage est identique cours express
  ou non. Aucune carte de l'examen n'entre dans la répétition espacée ni dans les erreurs (`S.mistakes`).
- **Note sur 20** : points pondérés par type de carte (`PTS`), crédit partiel pour `multi` et `sort`, arrondi à 0,5,
  mention et correction détaillée. Historique dans `S.pexams`.
- **Format d'un cas** : `{id, t, mods:[ids d'unités à revoir], ctx, cards:[3 à 7 cartes]}`. Types gérés : `mcq`, `story`,
  `fill`, `tf`, `num` (avec `tol`), `tiles`, `match` (`p`), `order` (`it`), `slider`, `sort` (`bins`, `it`), `multi`.
  Une carte peut porter `svg` (échiquier, damier : générés par un script, jamais dessinés à la main), `tab`, `pts`.
  `docs:[{t,h}]` ajoute un bouton « tableaux fournis » (barèmes, formules) comme sur un vrai sujet.
- **Charte d'une banque** (vérifiée par `texprat.js`) : 8 cas minimum, 80 minutes de matière au moins, 6 formats au
  moins, bonne réponse la plus longue dans 34 % des choix au plus, vrai ou faux entre 35 % et 65 %, explication `w` de
  40 caractères au moins, aucun emoji littéral, aucun tiret cadratin, chaque `mods` est une unité du cours. Écrire les
  distractors aussi longs que la bonne réponse dès le départ : corriger après coup coûte beaucoup plus cher.
- **Nouveau cours** : ajouter `cours/<CID>/examen.js` (premier caractère `/*EXAMEN*/`), sinon `ci_smoke.js` échoue.

## Mind map magique (demande du 14/10/2026)

À la fin de chaque cours, sous l'examen pratique : les grandes idées en mots clés floutés. Un toucher révèle (animation), un second
recouvre ; l'apprenant devine puis vérifie. Trois profondeurs (Essentiel, Approfondi, Expert) sur les mêmes nœuds, test `tests/tmindmap.js`.
- **Sources** : `cours/<CID>/mindmap.txt` (texte brut : `# Grande idée`, `- mot clé`, `-- détail`, `--- précision`, `[1]`, `[2]` ou `[3]`
  pour forcer le niveau). `tools/assemble.py` les injecte dans `window.MMAP[CID]`. Moteur : `design/arcade/mindmap.js` et `mindmap.css`.
- **Charte** (vérifiée par le test) : 4 à 12 grandes idées, au plus 6 flèches par notion à l'Essentiel (8 puis 10 aux niveaux détaillés),
  un mot clé de 7 mots au plus (en moyenne moins de 4), Essentiel de 18 à 100 nœuds, Expert au moins 20 % plus fourni qu'Approfondi.
  Le 20 % qui explique les 80 % : on retient les chiffres, les règles et les mnémos du cours, jamais de phrase.
- **Nouveau cours** : écrire `cours/<CID>/mindmap.txt` à partir des encadrés « Ce que tu dois retenir » des guides, sinon `ci_smoke.js` échoue.

## Cours express (demandes du 12/10/2026)

Réglage « Cours express » (Profil, Réglages, `S.settings.express`, désactivé par défaut, pour tout le monde).
Activé : chaque module est réduit à ses 18 exercices les plus importants (`expressPool(uid)` : les formats pratiques
story, num, multi... pèsent plus que tf et mcq, puis difficulté, notion étiquetée `nw`, et couverture régulière du
module ; un cas pratique en plusieurs cartes reste d'un bloc, donc 18 à 21 cartes ; un module de 18 exercices ou
moins est gardé entier). Chaque leçon pose 5 exercices neufs + 2 rappels de modules précédents (le plus oublié
d'abord). Un exercice n'est donc posé qu'une fois dans son module ; l'épreuve légendaire reste obligatoire et pioche
dans tout le module (`unitExos`). `lessonPool(uid)` (pool express ou complet) et `lessonStep(uid)` (5 ou 4)
remplacent `unitExos` et le « 4 » codé en dur pour découper un module en leçons : toute nouvelle fonction qui
découpe un module doit les utiliser. Test : `tests/texpress.js`.

**Tout ouvert (demande du 13/10/2026)** : en express, `unitUnlocked` renvoie toujours vrai (extras.js, section 8) et le bouton
de l'épreuve légendaire est actif sur tous les modules (`can` dans `arcade.js`), sans module précédent ni couronne
précédente. Les modules se font dans le désordre : les 2 rappels de chaque leçon viennent de tous les autres modules du
cours déjà vus (`buildLesson`, `lessonGate`), jamais d'un exercice jamais posé. Les jeux (`studied`) ignorent un module
jamais commencé. Le mode normal garde l'ordre et l'épreuve obligatoire. Tests : section 4 de `tests/texpress.js`.
