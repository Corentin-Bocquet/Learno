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

- Boutique : potions d'XP (x1,5 30 min, x2 15 min, x3 10 min), coffres du matin et du soir, pari de série,
  gels et coeurs.
- Ligue en ligne : table Supabase `learno_league` (SQL dans `supabase/learno_league.sql`, déjà appliqué).
  Les vrais joueurs remplacent des personnages fictifs.
- Supabase est accessible via le connecteur Composio de Corentin (projet `nrhkijgxbxslczutjrev`).
  Tables : `learno_state` (progression), `learno_league` (classement). Jamais de clé secrète dans le dépôt.

## Tests

Avant tout envoi : `tests/ci_smoke.js`, `tests/tall.js` pour chaque cours (`CID=...`), puis
`tbackup tcloud tui tmissions tpratique tpro tmasc tpatri tarcade`. Ajouter chaque nouveau cours dans
`.github/workflows/verification.yml` et relever les seuils de `tests/ci_smoke.js`.

## Publication : fusion automatique dans main (demande de Corentin, 24/09/2026)

Tout travail terminé est fusionné dans `main` automatiquement, sans redemander l'accord :
1. lancer les tests ci-dessus en local ;
2. committer et pousser sur la branche de travail, ouvrir la PR (ou réutiliser celle qui est ouverte) ;
3. attendre que la CI « tests » soit verte sur le dernier commit et qu'il n'y ait aucun conflit ;
4. passer la PR en « prête » et la fusionner dans `main` (méthode merge), puis arrêter la surveillance.

Si la CI est rouge, on corrige et on repousse ; on ne fusionne jamais une PR rouge ou en conflit.
Après une fusion, tout nouveau travail repart de `main` à jour, sur une nouvelle PR.
