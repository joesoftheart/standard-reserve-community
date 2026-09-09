begin;
do $$
declare uid uuid:=gen_random_uuid(); r jsonb; g jsonb; item jsonb; cid int; choice int; i int; result_count int; prior_choice int;
begin
 if (select count(*) from public.knowledge_questions where version='knowledge-100-v2')<>100 then raise exception 'COUNT'; end if;
 if has_table_privilege('anon','public.knowledge_questions','select') then raise exception 'ANSWER_KEYS_EXPOSED'; end if;
 if has_table_privilege('authenticated','public.knowledge_results','insert') then raise exception 'CLIENT_SCORE_WRITES'; end if;
 if has_function_privilege('anon','public.knowledge_question(public.knowledge_runs,integer)','execute') then raise exception 'HELPER_EXPOSED'; end if;
 insert into auth.users(id,raw_user_meta_data) values(uid,'{"user_name":"quiz-transaction-test"}');
 perform set_config('request.jwt.claim.sub',uid::text,true);
 r:=public.knowledge_start('th');
 if (r->>'count')::int<>0 or r->'question'?'correct' then raise exception 'START_STATE'; end if;
 begin perform public.knowledge_answer((r->>'id')::uuid,1,0);raise exception 'ORDER_ACCEPTED';exception when others then if sqlerrm<>'ANSWER_OUT_OF_ORDER' then raise;end if;end;
 for i in 0..99 loop
 select items->i into item from public.knowledge_runs where id=(r->>'id')::uuid;
 select v.ordinality::int-1 into choice from jsonb_array_elements(item->'order') with ordinality v where (v.value::text)::int=0;
 if i%10=0 then choice:=(choice+1)%4;end if;
 if i=0 then prior_choice:=choice;end if;
 r:=public.knowledge_answer((r->>'id')::uuid,i,choice);
 if i<99 and exists(select 1 from public.knowledge_results where id=(r->>'id')::uuid) then raise exception 'INCOMPLETE_RANKED';end if;
 if (r->>'count')::int<>i+1 then raise exception 'ANSWER_COUNT';end if;
 end loop;
 if (r->>'score')::int<>90 or not (r->>'saved')::boolean then raise exception 'COMPLETION_SAVE';end if;
 r:=public.knowledge_answer((r->>'id')::uuid,0,prior_choice);
 select count(*) into result_count from public.knowledge_results where id=(r->>'id')::uuid and score=90 and total=100;
 if result_count<>1 then raise exception 'IDEMPOTENCY';end if;
 if not exists(select 1 from public.knowledge_leaderboard() where mine and score=90) then raise exception 'LEADERBOARD';end if;
 perform set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
 begin perform public.knowledge_state((r->>'id')::uuid);raise exception 'OTHER_USER_ACCEPTED';exception when others then if sqlerrm<>'RUN_UNAVAILABLE' then raise;end if;end;
 perform set_config('request.jwt.claim.sub','',true);
 begin perform public.knowledge_start('en');raise exception 'GUEST_ACCEPTED';exception when others then if sqlerrm<>'LOGIN_REQUIRED' then raise;end if;end;
 begin perform public.knowledge_state((r->>'id')::uuid);raise exception 'GUEST_STATE_ACCEPTED';exception when others then if sqlerrm<>'LOGIN_REQUIRED' then raise;end if;end;
 begin perform public.knowledge_answer((r->>'id')::uuid,0,0);raise exception 'GUEST_ANSWER_ACCEPTED';exception when others then if sqlerrm<>'LOGIN_REQUIRED' then raise;end if;end;
 if has_function_privilege('anon','public.knowledge_start(text,uuid)','execute') or has_function_privilege('anon','public.knowledge_answer(uuid,integer,integer)','execute') then raise exception 'GUEST_RPC_ACCESS';end if;
 if has_function_privilege('authenticated','public.cleanup_unfinished_knowledge_runs()','execute') then raise exception 'CLEANUP_EXPOSED';end if;
 perform set_config('request.jwt.claim.sub',uid::text,true);
 -- An old completed result survives retention.
 update public.knowledge_runs set started_at=now()-interval '40 days',finished_at=now()-interval '39 days' where id=(r->>'id')::uuid;
 g:=public.knowledge_start('en');
 update public.knowledge_runs set started_at=now()-interval '31 days' where id=(g->>'id')::uuid;
 perform public.cleanup_unfinished_knowledge_runs();
 if exists(select 1 from public.knowledge_runs where id=(g->>'id')::uuid) then raise exception 'OLD_UNFINISHED_RETAINED';end if;
 if not exists(select 1 from public.knowledge_results where id=(r->>'id')::uuid) then raise exception 'COMPLETED_RESULT_DELETED';end if;
 r:=public.knowledge_start('th');g:=public.knowledge_start('th',(r->>'id')::uuid);
 begin perform public.knowledge_answer((r->>'id')::uuid,0,0);raise exception 'RESTART_ACCEPTED_OLD_RUN';exception when others then if sqlerrm<>'RUN_UNAVAILABLE' then raise;end if;end;
 if not exists(select 1 from public.knowledge_runs where id=(g->>'id')::uuid) then raise exception 'RECENT_RUN_REMOVED';end if;
 if not exists(select 1 from cron.job where jobname='knowledge-unfinished-retention' and active and schedule='15 20 * * *') then raise exception 'NO_RETENTION_JOB';end if;
 -- Rate-limit counts only this new fixture account; the old completed run is outside the window.
 for i in 1..13 loop g:=public.knowledge_start('en');end loop;
 begin perform public.knowledge_start('en');raise exception 'RATE_LIMIT_MISSING';exception when others then if sqlerrm<>'PLEASE_WAIT' then raise;end if;end;
end $$;
rollback;
select 'PASS: 100 questions, hidden answer keys, locked order, 100-answer auto-save, retry idempotency, user isolation, login required, incomplete runs excluded, 30-day retention, scheduled cleanup, rate limit, best-per-user leaderboard, restart; all test data rolled back' as verification;
