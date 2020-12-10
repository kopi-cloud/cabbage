create table public.welcome (
  -- took the structure of this by copying from a table I created in the SB UI
  id text constraint welcome_pkey primary key,
  value bigint not null
);

comment on table public.welcome is
'data for the welcome screen';

insert into public.welcome values ('visit_count', 0);

