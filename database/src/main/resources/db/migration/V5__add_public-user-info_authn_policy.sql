
create policy "only authn users can read public_user_info"
  on public.public_user_info
  using ( auth.role() = 'authenticated' );
