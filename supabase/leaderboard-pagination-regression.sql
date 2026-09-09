begin;
do $$
declare base_count int; uid uuid; rid uuid; i int; n int; pg int; result jsonb; item jsonb; last_rank int:=0;
begin
 base_count:=(public.knowledge_leaderboard_page(1)->>'total')::int;
 for i in 1..101 loop
 uid:=gen_random_uuid();rid:=gen_random_uuid();
 insert into auth.users(id,raw_user_meta_data) values(uid,jsonb_build_object('user_name','ranktest_'||i));
 insert into public.knowledge_runs(id,user_id,locale,version,items) values(rid,uid,'en','knowledge-100-v2',(select jsonb_agg('{}'::jsonb) from generate_series(1,100)));
 insert into public.knowledge_results(id,user_id,version,score,elapsed_ms,completed_at) values(rid,uid,'knowledge-100-v2',50,i*1000,now());
 end loop;
 n:=base_count+101;
 perform set_config('request.jwt.claim.sub','',true);
 if (public.knowledge_leaderboard_page(1)->>'total')::int<>n then raise exception 'TOTAL'; end if;
 for pg in 1..ceil(n/50.0)::int loop
 result:=public.knowledge_leaderboard_page(pg);
 if jsonb_array_length(result->'rows')<>least(50,n-(pg-1)*50) then raise exception 'PAGE_SIZE';end if;
 for item in select value from jsonb_array_elements(result->'rows') loop
 last_rank:=last_rank+1;
 if (item->>'rank')::int<>last_rank then raise exception 'RANK_GAP_OR_DUPLICATE';end if;
 if (item->>'mine')::boolean then raise exception 'GUEST_MINE';end if;
 end loop;
 end loop;
 if last_rank<>n then raise exception 'MISSING_PLAYERS';end if;
 if (public.knowledge_leaderboard_page(-1)->>'page')::int<>1 then raise exception 'NEGATIVE_PAGE';end if;
 if (public.knowledge_leaderboard_page(2147483647)->>'page')::int<>ceil(n/50.0)::int then raise exception 'LAST_PAGE_CLAMP';end if;
 if not has_function_privilege('anon','public.knowledge_leaderboard_page(integer)','execute') then raise exception 'GUEST_ACCESS';end if;
end $$;
rollback;
select 'PASS: 101 added players, total, 50-per-page, continuous ranks, guest access, page bounds. All fixtures rolled back.' as verification;
