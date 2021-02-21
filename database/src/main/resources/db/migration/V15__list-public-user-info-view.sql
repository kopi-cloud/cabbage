
-- drop view if exists  public.list_public_user_info;

create view public.list_public_user_info as
  select pui.uuid "uuid",
    pui.display_name "display_name",
    pui.about "about",
    au.created_at "created"
  from postgres.public.public_user_info pui
  left join auth.users au on pui.uuid = au.id
;

-- it's likely not even updatable, but I want to explore the pattern of 
-- creating read-only views
revoke insert, update, delete, truncate
on public.list_public_user_info 
from anon, authenticated, postgres, service_role
;

