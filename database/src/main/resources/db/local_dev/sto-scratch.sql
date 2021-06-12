select au.id "uuid",
  pui.display_name "display_name",
  au.email,
  au.raw_app_meta_data,
  pui.about "about",
  au.created_at "created"
from auth.users au
  left join postgres.public.public_user_info pui on pui.uuid = au.id
order by au.updated_at desc
;

select * 
from auth.users;

select * from flyway_schema_history;

select * from pg_policies;

select * from public_user_info;

drop policy if exists "only authn users can read public_user_info"
  on public.public_user_info;
drop policy if exists "users can insert only own  public_user_info"
  on public.public_user_info;
drop policy if exists "users can update only own  public_user_info"
  on public.public_user_info;
drop policy if exists "users can delete only own public_user_info"
  on public.public_user_info;


create policy "only authn users can read public_user_info"
  on public.public_user_info
  for select
  using ( auth.role() = 'authenticated' );
create policy "users can insert only own  public_user_info"
  on public.public_user_info
  for insert
  with check (auth.uid() = uuid);
create policy "users can update only own  public_user_info"
  on public.public_user_info
  for update
  using ( auth.role() = 'authenticated' )
  with check (auth.uid() = uuid);
create policy "users can delete only own public_user_info"
  on public.public_user_info
  for delete
  using (auth.uid() = uuid);

create policy "users can insert"
  on public.public_user_info
  for insert with check (true);
create policy "users can update"
  on public.public_user_info
  for update using (true) with check (true) ;
create policy "users can select"
  on public.public_user_info
  for select using (true);

drop policy "users can select"
  on public.public_user_info;
drop policy "users can update"
  on public.public_user_info;
drop policy "users can insert"
  on public.public_user_info;

create policy "only authn users can read public_user_info"
  on public.public_user_info
  for select
  using ( auth.role() = 'authenticated' );

alter table public.public_user_info
  enable row level security ;


select public.notify_api_restart();

select id, email from auth.users where email = 'wibble@wobble';

select * from public_user_info;

insert into public_user_info as pui
select users.id, ''
from auth.users
where email = 'wibble@wobble'
;