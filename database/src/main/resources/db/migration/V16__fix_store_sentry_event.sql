drop function public.store_sentry_event(json_content jsonb);

-- I'm positive this used to work as with "returns void", but 
-- Supabase started causing an error:
-- Uncaught (in promise) SyntaxError: JSON.parse: unexpected end of data at line 1 column 1 of the JSON data
create or replace function public.store_sentry_event(json_content jsonb)
  returns text security definer
  language sql
as $$
insert into private.sentry_event (received, content)
values(transaction_timestamp(), json_content);

select '';
$$
;
