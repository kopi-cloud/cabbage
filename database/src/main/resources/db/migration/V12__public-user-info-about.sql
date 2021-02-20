
alter table public.public_user_info
add column about varchar(200) not null default '';

alter table public.public_user_info
alter column display_name set default '',
alter column display_name set not null;

comment on column public.public_user_info.display_name is
'short name that the user can set that other people can see, ' 
' intended for list display';

comment on column public.public_user_info.display_name is
'details about the user that the user can set and other people can see';


