begin;
create or replace function public.knowledge_leaderboard_page(p_page integer default 1) returns jsonb
language sql stable security definer set search_path='' as $$
 with best as (
 select distinct on (r.user_id) r.user_id,r.score,r.elapsed_ms,r.completed_at
 from public.knowledge_results r where r.version='knowledge-100-v2'
 order by r.user_id,r.score desc,r.elapsed_ms asc,r.completed_at asc
 ), ranked as (
 select row_number() over(order by b.score desc,b.elapsed_ms asc,b.completed_at asc,b.user_id) as rank,
 coalesce(u.username,'learner') as username,
 case when u.username ~ '^@?[A-Za-z0-9_]{1,15}$' then ltrim(u.username,'@') end as x_handle,
 b.score,b.elapsed_ms,coalesce(b.user_id=auth.uid(),false) as mine
 from best b left join public.users u on u.id=b.user_id
 ), meta as (select count(*) as total, least(greatest(coalesce(p_page,1),1),greatest(1,ceil(count(*)/50.0)::integer)) as page from ranked),
 paged as (select r.* from ranked r cross join meta m where r.rank>(m.page::bigint-1)*50 and r.rank<=m.page::bigint*50 order by r.rank)
 select jsonb_build_object('total',m.total,'page',m.page,'rows',coalesce((select jsonb_agg(to_jsonb(p) order by p.rank) from paged p),'[]'::jsonb)) from meta m;
$$;
revoke all on function public.knowledge_leaderboard_page(integer) from public,anon,authenticated;
grant execute on function public.knowledge_leaderboard_page(integer) to anon,authenticated;
commit;
