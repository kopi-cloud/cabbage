-- replaced by sentry_event
-- If I was concerned about a zero-downtime deployment, I'd only migrate to
-- V9, then wait a while (week or so) before migrating to V10. V10 might also
-- include SQL to merge events into the new table (but I'm just dropping them,
-- it's just error logging).

drop function if exists public.store_error;
drop table if exists private.cabbage_error;




