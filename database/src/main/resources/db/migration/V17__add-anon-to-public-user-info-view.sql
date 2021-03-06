

create or replace view public.list_public_user_info as
select au.id "uuid",
  pui.display_name "display_name",
  pui.about "about",
  au.created_at "created"
from auth.users au
  left join postgres.public.public_user_info pui on pui.uuid = au.id
;

comment on view public.list_public_user_info is
'used to query all users (including anon) and know their created time';