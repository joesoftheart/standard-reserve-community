begin;
create table public.site_visits(day date not null default (now() at time zone 'UTC')::date,session_id uuid not null,path text not null,kind text not null,events integer not null default 1,last_seen timestamptz not null default now(),primary key(day,session_id,path,kind));
alter table public.site_visits enable row level security;
revoke all on public.site_visits from anon,authenticated;
create or replace function public.record_site_visit(p_session uuid,p_path text,p_kind text default 'view') returns void language plpgsql security definer set search_path='' as $$
begin
 if p_session is null or p_path !~ '^/(en|th)(/(learn|quiz|challenges|simulate|community|founder|rankings|about|privacy))?$' or p_kind not in ('view','runtime','quiz_connection','auth_connection') then raise exception 'INVALID_EVENT';end if;
 insert into public.site_visits(session_id,path,kind) values(p_session,p_path,p_kind) on conflict(day,session_id,path,kind) do update set events=least(public.site_visits.events+1,500),last_seen=now() where public.site_visits.last_seen<now()-interval '30 seconds';
end $$;
revoke all on function public.record_site_visit(uuid,text,text) from public;
grant execute on function public.record_site_visit(uuid,text,text) to anon,authenticated;
create or replace function public.site_stats() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if not public.is_community_admin() then raise exception 'ADMIN_REQUIRED';end if;
 select jsonb_build_object('views',coalesce(sum(events) filter(where kind='view'),0),'sessions',count(distinct session_id) filter(where kind='view'),'errors',coalesce(sum(events) filter(where kind<>'view'),0),'days',(select coalesce(jsonb_agg(to_jsonb(d) order by d.day desc),'[]'::jsonb) from(select day,coalesce(sum(events) filter(where kind='view'),0) views,count(distinct session_id) filter(where kind='view') sessions,coalesce(sum(events) filter(where kind<>'view'),0) errors from public.site_visits where day>=(now() at time zone 'UTC')::date-29 group by day) d)) into result from public.site_visits where day>=(now() at time zone 'UTC')::date-29;
 return result;
end $$;
revoke all on function public.site_stats() from public,anon;
grant execute on function public.site_stats() to authenticated;
select cron.schedule('site-analytics-retention','25 20 * * *',$job$delete from public.site_visits where day<(now() at time zone 'UTC')::date-29;$job$);
commit;
