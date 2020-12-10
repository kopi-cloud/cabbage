drop table if exists public.user_info;

create table public.user_info (
  uuid uuid not null
    constraint users_pkey primary key
    references auth.users(id),
  display_name varchar(12) null
);

comment on table public.user_info is
  'info provided by the user';

comment on column public.user_info.display_name is
  'unicode characters, not bytes';


