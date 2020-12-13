
select * from welcome;

select * from pg_policies;

drop policy if exists "only authn users can read public_user_info"
  on public.public_user_info
;


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