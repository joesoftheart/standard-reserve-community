begin;
do $$
declare sid uuid:=gen_random_uuid(); baseline jsonb; after_count jsonb;
begin
 if has_table_privilege('anon','public.site_visits','select') or has_table_privilege('authenticated','public.site_visits','select') then raise exception 'RAW_DATA_EXPOSED';end if;
 if has_function_privilege('anon','public.site_stats()','execute') then raise exception 'GUEST_STATS_EXPOSED';end if;
 perform set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
 begin perform public.site_stats();raise exception 'NON_ADMIN_ACCEPTED';exception when others then if sqlerrm<>'ADMIN_REQUIRED' then raise;end if;end;
 perform set_config('request.jwt.claim.sub','b0f68498-fc5a-4d03-9db0-93fbbd3ae5f1',true);
 baseline:=public.site_stats();
 perform public.record_site_visit(sid,'/en','view');
 perform public.record_site_visit(sid,'/en','view');
 perform public.record_site_visit(sid,'/en/learn','quiz_connection');
 begin perform public.record_site_visit(sid,'/auth/callback?token=secret','view');raise exception 'PRIVATE_PATH_ACCEPTED';exception when others then if sqlerrm<>'INVALID_EVENT' then raise;end if;end;
 begin perform public.record_site_visit(sid,'/en','raw-error-message');raise exception 'RAW_ERROR_ACCEPTED';exception when others then if sqlerrm<>'INVALID_EVENT' then raise;end if;end;
 after_count:=public.site_stats();
 if (after_count->>'views')::int<>(baseline->>'views')::int+1 or (after_count->>'sessions')::int<>(baseline->>'sessions')::int+1 or (after_count->>'errors')::int<>(baseline->>'errors')::int+1 then raise exception 'INCORRECT_COUNTS';end if;
 if not exists(select 1 from cron.job where jobname='site-analytics-retention' and active) then raise exception 'NO_CLEANUP';end if;
end $$;
rollback;
select 'PASS: admin isolation, private raw data, deduplication, aggregate counts, allowlisted fields, scheduled retention. Fixtures rolled back.' as verification;
