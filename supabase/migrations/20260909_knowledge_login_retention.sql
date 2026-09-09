begin;
create or replace function public.knowledge_start(p_locale text,p_previous uuid default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare rid uuid; items jsonb; q record; ord jsonb;
begin
 if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 if p_locale not in ('en','th') then raise exception 'INVALID_LOCALE'; end if;
 if p_previous is not null then
 update public.knowledge_runs set abandoned=true where id=p_previous and finished_at is null and user_id=auth.uid();
 end if;
 if auth.uid() is not null and (select count(*) from public.knowledge_runs where user_id=auth.uid() and started_at>clock_timestamp()-interval '1 minute')>=15 then raise exception 'PLEASE_WAIT'; end if;
 items:='[]';
 for q in select id from public.knowledge_questions where version='knowledge-100-v2' order by random() limit 100 loop
 select jsonb_agg(x.n) into ord from (select n from generate_series(0,3) n order by random()) x;
 items:=items||jsonb_build_array(jsonb_build_object('id',q.id,'order',ord));
 end loop;
 if jsonb_array_length(items)<>100 then raise exception 'QUESTION_BANK_NOT_READY'; end if;
 insert into public.knowledge_runs(user_id,locale,items) values(auth.uid(),p_locale,items) returning id into rid;
 return public.knowledge_state(rid);
end $$;
create or replace function public.knowledge_state(p_id uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare r public.knowledge_runs; saved boolean;
begin
 if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
 select * into r from public.knowledge_runs where id=p_id;
 if not found or r.abandoned or r.user_id is distinct from auth.uid() then raise exception 'RUN_UNAVAILABLE'; end if;
 select exists(select 1 from public.knowledge_results where id=r.id) into saved;
 return jsonb_build_object('id',r.id,'locale',r.locale,'count',jsonb_array_length(r.answers),'score',r.score,
 'elapsed',floor(extract(epoch from (coalesce(r.finished_at,clock_timestamp())-r.started_at))*1000),
 'finished',r.finished_at is not null,'saved',saved,'ranked',r.user_id is not null,
 'history',r.answers,'question',public.knowledge_question(r,jsonb_array_length(r.answers)));
end $$;

create or replace function public.knowledge_answer(p_id uuid,p_index integer,p_choice integer) returns jsonb
language plpgsql security definer set search_path='' as $$
declare r public.knowledge_runs; q public.knowledge_questions; item jsonb; answer jsonb; correct_position integer; n integer;
begin
 if auth.uid() is null then raise exception 'LOGIN_REQUIRED'; end if;
 if p_choice is null or p_choice not between 0 and 3 or p_index is null or p_index not between 0 and 99 then raise exception 'INVALID_ANSWER'; end if;
 select * into r from public.knowledge_runs where id=p_id for update;
 if not found or r.abandoned or r.user_id is distinct from auth.uid() then raise exception 'RUN_UNAVAILABLE'; end if;
 n:=jsonb_array_length(r.answers);
 if p_index<n then
 if (r.answers->p_index->>'choice')::int<>p_choice then raise exception 'ANSWER_LOCKED'; end if;
 return public.knowledge_state(r.id); -- same request retry is idempotent
 end if;
 if p_index<>n or r.finished_at is not null then raise exception 'ANSWER_OUT_OF_ORDER'; end if;
 item:=r.items->p_index;
 select * into strict q from public.knowledge_questions where id=(item->>'id')::int;
 select v.ordinality::int-1 into correct_position from jsonb_array_elements(item->'order') with ordinality v where (v.value::text)::int=q.correct;
 answer:=public.knowledge_question(r,p_index)||jsonb_build_object('choice',p_choice,'correct',correct_position,'ok',p_choice=correct_position,'explanation',q.content->r.locale->>'explanation','anchor',q.anchor);
 update public.knowledge_runs set answers=answers||jsonb_build_array(answer),score=score+case when p_choice=correct_position then 1 else 0 end,
 finished_at=case when n=99 then clock_timestamp() else null end where id=r.id returning * into r;
 if r.finished_at is not null and r.user_id is not null then
 insert into public.knowledge_results(id,user_id,version,score,elapsed_ms,completed_at) values(r.id,r.user_id,r.version,r.score,floor(extract(epoch from(r.finished_at-r.started_at))*1000)::bigint,r.finished_at) on conflict(id) do nothing;
 end if;
 return public.knowledge_state(r.id);
end $$;

revoke execute on function public.knowledge_start(text,uuid),public.knowledge_state(uuid),public.knowledge_answer(uuid,integer,integer) from public,anon;
grant execute on function public.knowledge_start(text,uuid),public.knowledge_state(uuid),public.knowledge_answer(uuid,integer,integer) to authenticated;
create index if not exists knowledge_runs_user_started_idx on public.knowledge_runs(user_id,started_at);
create index if not exists knowledge_runs_unfinished_started_idx on public.knowledge_runs(started_at) where finished_at is null;
create or replace function public.cleanup_unfinished_knowledge_runs() returns integer
language plpgsql security definer set search_path='' as $$
declare removed integer;
begin
 delete from public.knowledge_runs r where r.finished_at is null and r.started_at < now()-interval '30 days'
 and not exists(select 1 from public.knowledge_results x where x.id=r.id);
 get diagnostics removed = row_count;
 return removed;
end $$;
revoke all on function public.cleanup_unfinished_knowledge_runs() from public,anon,authenticated;
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('knowledge-unfinished-retention','15 20 * * *','select public.cleanup_unfinished_knowledge_runs();');
commit;
