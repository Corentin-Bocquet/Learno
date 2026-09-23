-- Learno : ligue multijoueur
-- A coller une seule fois dans Supabase > SQL Editor > New query > Run.
-- Chaque joueur connecte publie une ligne publique : prenom, avatar, XP de la semaine.
-- Tout joueur connecte peut LIRE le classement, mais chacun n'ECRIT que sa propre ligne.

create table if not exists public.learno_league (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  name       text        not null default 'Joueur' check (char_length(name) <= 24),
  xp_week    integer     not null default 0 check (xp_week >= 0 and xp_week < 1000000),
  tier       smallint    not null default 0 check (tier between 0 and 5),
  avatar     jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists learno_league_recent on public.learno_league (updated_at desc, xp_week desc);

alter table public.learno_league enable row level security;

drop policy if exists "ligue lisible par les joueurs connectes" on public.learno_league;
create policy "ligue lisible par les joueurs connectes"
  on public.learno_league for select
  to authenticated
  using (true);

drop policy if exists "chacun cree sa ligne" on public.learno_league;
create policy "chacun cree sa ligne"
  on public.learno_league for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "chacun modifie sa ligne" on public.learno_league;
create policy "chacun modifie sa ligne"
  on public.learno_league for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "chacun retire sa ligne" on public.learno_league;
create policy "chacun retire sa ligne"
  on public.learno_league for delete
  to authenticated
  using (auth.uid() = user_id);
