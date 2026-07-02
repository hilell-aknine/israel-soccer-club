-- מועדון הכדורגל — טבלאות ענן (יושבות על פרויקט אגם, מגירה נפרדת)
-- הפיך לחלוטין: drop table public.soccer_saves, public.club_profiles;

create table if not exists public.soccer_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.soccer_saves enable row level security;

create table if not exists public.club_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  level int default 1,
  updated_at timestamptz not null default now()
);
alter table public.club_profiles enable row level security;

-- helper security-definer כדי למנוע רקורסיית-RLS בעת ביקור אצל חבר
create or replace function public.has_club(uid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists(select 1 from public.club_profiles where user_id = uid);
$$;

-- soccer_saves: כתיבה/קריאה לעצמך + קריאה למי שיש לו פרופיל מועדון (ביקורים)
drop policy if exists own_all on public.soccer_saves;
create policy own_all on public.soccer_saves
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists visit_select on public.soccer_saves;
create policy visit_select on public.soccer_saves
  for select to authenticated using (public.has_club(user_id));

-- club_profiles: כולם קוראים (רשימת חברים) · כותב רק לעצמו
drop policy if exists profiles_read on public.club_profiles;
create policy profiles_read on public.club_profiles
  for select to authenticated using (true);
drop policy if exists profiles_write on public.club_profiles;
create policy profiles_write on public.club_profiles
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
