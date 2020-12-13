
-- old "for all" policy was no good because multiple policies are "OR"ed
drop policy if exists "only authn users can read public_user_info"
  on public.public_user_info;

-- so new "must be authenticated" policy applies only to select statements
create policy "only authn users can read public_user_info"
  on public.public_user_info
  for select
  using ( auth.role() = 'authenticated' );

-- this was no good because it didn't have a "using" clause, which meant it
-- would fail when trying to do an "upsert" statement
drop policy if exists "users can update only own  public_user_info"
  on public.public_user_info;

create policy "users can update only own  public_user_info"
  on public.public_user_info
  for update
  using ( auth.role() = 'authenticated' )
  with check (auth.uid() = uuid);

