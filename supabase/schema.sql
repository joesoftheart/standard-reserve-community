-- Run once in the Supabase SQL editor. Anonymous browsing is allowed.
create table public.users (
 id uuid primary key references auth.users(id) on delete cascade,
 x_user_id text, username text not null, display_name text, avatar text,
 created_at timestamptz not null default now()
);
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.users(id,x_user_id,username,display_name,avatar) values(new.id,new.raw_user_meta_data->>'provider_id',coalesce(new.raw_user_meta_data->>'user_name',new.raw_user_meta_data->>'preferred_username','learner'),new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'avatar_url');
 return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create table public.community_members(id uuid primary key default gen_random_uuid(),name text not null,x_username text not null default '',avatar text not null default '',description text not null default '',contribution text not null default '',category text not null check(category in ('Research','Education','Simulation','Content','Development','Community')),link text not null default '',featured boolean not null default false);
create table public.quiz_results(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.users(id) on delete cascade,quiz_id text not null,score integer not null check(score between 0 and 10),created_at timestamptz not null default now());
create table public.challenge_results(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.users(id) on delete cascade,challenge_id text not null,score integer not null check(score between 0 and 100),result jsonb not null,created_at timestamptz not null default now());
create table public.simulation_results(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.users(id) on delete cascade,scenario text not null,result jsonb not null,created_at timestamptz not null default now());
alter table public.users enable row level security;
alter table public.community_members enable row level security;
alter table public.quiz_results enable row level security;
alter table public.challenge_results enable row level security;
alter table public.simulation_results enable row level security;
create policy users_public on public.users for select using(true);
create policy community_public on public.community_members for select using(true);
create policy quiz_read on public.quiz_results for select using(true);
create policy quiz_insert on public.quiz_results for insert to authenticated with check(auth.uid()=user_id and quiz_id='knowledge-v1');
create policy challenge_read on public.challenge_results for select using(true);
create policy challenge_insert on public.challenge_results for insert to authenticated with check(auth.uid()=user_id and challenge_id in ('0','1','2','3','4','5'));
create policy simulation_read on public.simulation_results for select to authenticated using(auth.uid()=user_id);
create policy simulation_insert on public.simulation_results for insert to authenticated with check(auth.uid()=user_id);
-- Scores are client-submitted educational results, never competitive verified scores.
create view public.leaderboard with(security_invoker=true) as
select u.username,'quiz'::text as kind,max(q.score) as score from public.quiz_results q join public.users u on u.id=q.user_id group by u.id,u.username
union all
select u.username,'challenge'::text as kind,max(c.score) as score from public.challenge_results c join public.users u on u.id=c.user_id group by u.id,u.username;
grant select on public.leaderboard,public.users,public.community_members,public.quiz_results,public.challenge_results to anon,authenticated;
grant insert on public.quiz_results,public.challenge_results,public.simulation_results to authenticated;
grant select on public.simulation_results to authenticated;
