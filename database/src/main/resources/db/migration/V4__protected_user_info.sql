-- drop table if exists public.public_user_info;
-- drop table if exists public.private_user_info;



create table public.public_user_info (
  uuid uuid not null primary key
    references auth.users(id),
  display_name varchar(12) null
);

comment on table public.public_user_info is
  'info provided by the user that other users can read but not write';

comment on column public.public_user_info.display_name is
  'unicode characters, not bytes';

alter table public.public_user_info
  enable row level security;

create policy "users can insert only own  public_user_info"
  on public.public_user_info
  for insert
  with check (auth.uid() = uuid);
create policy "users can update only own  public_user_info"
  on public.public_user_info
  for update
  with check (auth.uid() = uuid);
create policy "users can delete only own public_user_info"
  on public.public_user_info
  for delete
  using (auth.uid() = uuid);


create table public.private_user_info (
  uuid uuid not null primary key
    references auth.users(id),
  contact_details varchar(300) null
);

alter table public.private_user_info
  enable row level security;

create policy "users can view/update only own private_user_info"
  on public.private_user_info
  using (auth.uid() = uuid);

comment on table public.private_user_info is
  'private info of user other users cannot read or write';

comment on column public.private_user_info.contact_details is
  'for the admins to use to contact a user';

comment on table public.user_info is
  'deprecated by public_user_info table';

