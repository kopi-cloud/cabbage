
-- I don't know why I declared it json :(

alter table private.sentry_event
  alter column content type jsonb
;
