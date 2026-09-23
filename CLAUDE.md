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
- Le cours porte une catégorie `cat` : `ecole`, `jeux`, `diver`, `style`, `livres` (liste `CATS`).
- Les données sont ajoutées dans un script à part, placé avant le moteur (voir le bloc
  `<!-- PATRI:DEBUT -->`). Identifiants d'unités à la suite des existants, identifiants d'exercices
  préfixés et uniques.

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
`tbackup tcloud tui tmissions tpratique tpro tmasc tpatri`. Ajouter chaque nouveau cours dans
`.github/workflows/verification.yml` et relever les seuils de `tests/ci_smoke.js`.
