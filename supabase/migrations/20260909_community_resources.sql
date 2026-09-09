begin;
create table if not exists public.community_admins(user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.community_admins enable row level security;
revoke all on public.community_admins from anon,authenticated;
create or replace function public.is_community_admin() returns boolean language sql stable security definer set search_path='' as $$ select exists(select 1 from public.community_admins where user_id=auth.uid()); $$;
revoke all on function public.is_community_admin() from public;
grant execute on function public.is_community_admin() to anon,authenticated;
create table if not exists public.community_resources(
 id uuid primary key default gen_random_uuid(),url text not null unique check(length(url)<=2048 and url ~ '^https://[^[:space:]]+$'),
 kind text not null check(kind in ('post','article','tool')),
 title_th text not null default '' check(length(title_th)<=120),title_en text not null default '' check(length(title_en)<=120),
 description_th text not null default '' check(length(description_th)<=300),description_en text not null default '' check(length(description_en)<=300),
 creator text not null check(length(btrim(creator)) between 1 and 100),x_username text not null default '' check(x_username='' or x_username ~ '^[A-Za-z0-9_]{1,15}$'),
 tags text[] not null default '{}' check(cardinality(tags)<=8),cover_path text,
 status text not null default 'draft' check(status in ('draft','published','hidden')),featured boolean not null default false,
 created_by uuid not null default auth.uid() references auth.users(id),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 check(length(btrim(title_th))>0 or length(btrim(title_en))>0),
 check(cover_path is null or cover_path ~ '^[a-f0-9-]+/[a-f0-9-]+\.(png|jpg|webp)$')
);
alter table public.community_resources enable row level security;
create policy community_resources_read on public.community_resources for select to anon,authenticated using(status='published' or public.is_community_admin());
create policy community_resources_create on public.community_resources for insert to authenticated with check(public.is_community_admin() and created_by=auth.uid());
create policy community_resources_edit on public.community_resources for update to authenticated using(public.is_community_admin()) with check(public.is_community_admin());
grant select on public.community_resources to anon,authenticated;
grant insert,update on public.community_resources to authenticated;
create or replace function public.community_resource_timestamp() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now();new.created_at=old.created_at;new.created_by=old.created_by;return new;end $$;
create trigger community_resource_timestamp before update on public.community_resources for each row execute function public.community_resource_timestamp();
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('community-covers','community-covers',true,5242880,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing;
create policy community_cover_upload on storage.objects for insert to authenticated with check(bucket_id='community-covers' and public.is_community_admin() and (storage.foldername(name))[1]=auth.uid()::text);
create policy community_cover_remove on storage.objects for delete to authenticated using(bucket_id='community-covers' and public.is_community_admin() and (storage.foldername(name))[1]=auth.uid()::text);
create policy community_cover_admin_read on storage.objects for select to authenticated using(bucket_id='community-covers' and public.is_community_admin());
insert into public.community_admins(user_id) values('b0f68498-fc5a-4d03-9db0-93fbbd3ae5f1') on conflict do nothing;
commit;
