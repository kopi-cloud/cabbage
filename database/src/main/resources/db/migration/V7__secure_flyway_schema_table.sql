-- don't want people to be able to write to this!
-- adding RLS without a policy should mean it can't be read or written
alter table public.flyway_schema_history
  enable row level security;

drop policy if exists all_role_select
  on public.flyway_schema_history;

create policy all_role_select
  on public.flyway_schema_history
  for select
  using ( true );


