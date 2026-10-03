create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Owners can view their households"
on public.households
for select
to authenticated
using ((select auth.uid()) = owner_id);

create policy "Owners can create households"
on public.households
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

create policy "Owners can update their households"
on public.households
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "Owners can delete their households"
on public.households
for delete
to authenticated
using ((select auth.uid()) = owner_id);

create policy "Owners can manage delegates"
on public.delegates
for all
to authenticated
using (
  exists (
    select 1
    from public.households
    where households.id = delegates.household_id
      and households.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.households
    where households.id = delegates.household_id
      and households.owner_id = (select auth.uid())
  )
);

create policy "Owners can manage household items"
on public.household_items
for all
to authenticated
using (
  exists (
    select 1
    from public.households
    where households.id = household_items.household_id
      and households.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.households
    where households.id = household_items.household_id
      and households.owner_id = (select auth.uid())
  )
);

create policy "Owners can manage tasks"
on public.tasks
for all
to authenticated
using (
  exists (
    select 1
    from public.households
    where households.id = tasks.household_id
      and households.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.households
    where households.id = tasks.household_id
      and households.owner_id = (select auth.uid())
  )
);

create policy "Owners can manage emergency sessions"
on public.emergency_sessions
for all
to authenticated
using (
  exists (
    select 1
    from public.households
    where households.id = emergency_sessions.household_id
      and households.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.households
    where households.id = emergency_sessions.household_id
      and households.owner_id = (select auth.uid())
  )
);

create policy "Owners can view their audit logs"
on public.audit_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.households
    where households.id = audit_logs.household_id
      and households.owner_id = (select auth.uid())
  )
);

create policy "Owners can create their audit logs"
on public.audit_logs
for insert
to authenticated
with check (
  exists (
    select 1
    from public.households
    where households.id = audit_logs.household_id
      and households.owner_id = (select auth.uid())
  )
);