# Learno

Jeu de revision facon Duolingo, en un seul fichier HTML, avec progression synchronisee sur un serveur.

**En ligne :** https://corentin-bocquet.github.io/Learno/

## Contenu

10 cours, 148 unites, 2041 exercices, ranges par familles (Ecole, Jeux, Divertissement, Style, Livres et idees).

| Cours | Sujet |
|---|---|
| MRC | Risque de credit |
| Banque | Economie bancaire |
| Patrimoine | Transmission du patrimoine (16 modules, 512 exercices, chiffres verifies au 23/09/2026) |
| Style | Style masculin |
| Humour | Raconter et faire rire |
| Poker | No Limit Hold'em, debutant a expert |
| Dames | Jeu de dames international |
| YouTube | De 0 a 100 000 abonnes |
| Risque | Analyste risque en banque |
| Nietzsche | Penser avec un marteau |

## Design

Refonte « Arcade » (septembre 2026) : fond marine, grosses cartes colorées, accueil en une vue
(série de la semaine, carte Reprendre, coffre du jour, programme), parcours en **Modules** ou en
**Chemin** au choix, corrections avec l'explication et le mémo du module, fin de leçon
XP / précision / temps. Sources dans `design/arcade/`, injectées par `python3 tools/design.py`.

## Fonctions de jeu

- **Nouveaux jeux** (onglet Réviser et accueil) : Éclair 60 s (paires), Vrai ou faux express (on glisse
  les cartes), Frise (remettre des étapes dans l'ordre), Boss du module (battre le Diable pour un coffre
  légendaire), Duel de ligue (contre son rival direct). Ils utilisent les exercices existants et
  alimentent la répétition espacée.

- **Boutique** : les gemmes achetent des potions d'XP (x1,5, x2, x3), des gels de serie, des coeurs ;
  coffres du matin et du soir, pari de serie.
- **Examen blanc** : trois niveaux (10/20/30, 15/40/60, 30/60/100 questions) sur 8, 20 et 35 minutes.
- **Revisions inter-modules** : dans les cours marques `mix`, chaque lecon melange questions neuves et rappels
  des modules precedents.
- **Ligue en ligne** : les joueurs connectes apparaissent dans la ligue a la place des personnages fictifs
  (table `learno_league`, voir `supabase/learno_league.sql`).

## Synchronisation

La progression vit d'abord dans le localStorage du navigateur. Avec un compte, elle est
aussi poussee sur Supabase (Postgres), ce qui permet de reprendre sur n'importe quel appareil.

- Authentification : email et mot de passe (Supabase Auth)
- Stockage : table `learno_state`, une ligne par utilisateur, colonne `data` en JSONB
- Classement : table `learno_league`, lisible par les joueurs connectes, chacun n'ecrit que sa ligne
- Isolation : Row Level Security, chaque utilisateur ne peut lire et ecrire que sa propre ligne
- Hors ligne : si le serveur est injoignable, l'application fonctionne normalement en local

La cle publique `anon` presente dans le HTML est faite pour etre exposee cote navigateur.
Aucune cle secrete ni `service_role` n'est presente dans ce depot.

## Sauvegarde locale

Export et import d'un fichier `.json` depuis le profil, en complement du serveur.
