-- Nano Playground — Supabase schema
-- Run in the Supabase SQL editor. Uses RLS; never expose a service-role key.

create type public.favorite_type as enum ('lab', 'tool');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type public.favorite_type not null,
  item_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type public.favorite_type not null,
  item_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.learning_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lab_id text not null,
  percent int not null default 0 check (percent between 0 and 100),
  visits int not null default 0,
  last_visited_at timestamptz not null default now(),
  primary key (user_id, lab_id)
);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.activities enable row level security;
alter table public.learning_progress enable row level security;

create policy "profiles are self readable" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles are self writable" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles are self updatable" on public.profiles
  for update using (auth.uid() = id);

create policy "favorites are self readable" on public.favorites
  for select using (auth.uid() = user_id);
create policy "favorites are self writable" on public.favorites
  for insert with check (auth.uid() = user_id);
create policy "favorites are self removable" on public.favorites
  for delete using (auth.uid() = user_id);

create policy "activities are self readable" on public.activities
  for select using (auth.uid() = user_id);
create policy "activities are self insertable" on public.activities
  for insert with check (auth.uid() = user_id);

create policy "progress is self readable" on public.learning_progress
  for select using (auth.uid() = user_id);
create policy "progress is self writable" on public.learning_progress
  for insert with check (auth.uid() = user_id);
create policy "progress is self updatable" on public.learning_progress
  for update using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create index if not exists activities_user_created_idx
  on public.activities (user_id, created_at desc);
create index if not exists favorites_user_idx
  on public.favorites (user_id);
