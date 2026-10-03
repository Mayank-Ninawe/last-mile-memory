create extension if not exists "pgcrypto";

create type public.task_category as enum (
  'childcare',
  'pet_care',
  'bills',
  'medication',
  'emergency_contact'
);

create type public.delegate_role as enum (
  'owner',
  'childcare_delegate',
  'finance_delegate'
);

create type public.task_status as enum (
  'pending',
  'completed',
  'needs_confirmation'
);

create type public.emergency_mode as enum (
  'hospitalization'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now()
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  emergency_mode_active boolean not null default false,
  active_emergency_mode public.emergency_mode,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.delegates (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  relationship text not null default '',
  email text,
  phone text,
  role public.delegate_role not null,
  allowed_categories public.task_category[] not null default '{}',
  access_token uuid not null default gen_random_uuid() unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.household_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  title text not null,
  content text not null,
  category public.task_category not null,
  source_name text not null default 'Manual household note',
  sensitivity text not null default 'normal'
    check (sensitivity in ('normal', 'restricted', 'private')),
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  household_item_id uuid references public.household_items(id) on delete set null,
  title text not null,
  description text not null,
  category public.task_category not null,
  priority integer not null default 3 check (priority between 1 and 5),
  deadline_text text,
  assigned_role public.delegate_role,
  sensitivity text not null default 'normal'
    check (sensitivity in ('normal', 'restricted', 'private')),
  confidence numeric(3,2) not null default 0.50
    check (confidence between 0 and 1),
  why_important text not null default '',
  status public.task_status not null default 'pending',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table public.emergency_sessions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  mode public.emergency_mode not null,
  is_active boolean not null default true,
  activated_by uuid references public.profiles(id) on delete set null,
  activated_at timestamptz not null default now(),
  deactivated_at timestamptz
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  actor_type text not null check (actor_type in ('owner', 'delegate', 'system')),
  actor_name text not null,
  action text not null,
  details text,
  created_at timestamptz not null default now()
);

create index households_owner_id_idx on public.households(owner_id);
create index delegates_household_id_idx on public.delegates(household_id);
create index delegates_access_token_idx on public.delegates(access_token);
create index household_items_household_id_idx on public.household_items(household_id);
create index tasks_household_id_idx on public.tasks(household_id);
create index tasks_status_idx on public.tasks(status);
create index emergency_sessions_household_id_idx on public.emergency_sessions(household_id);
create index audit_logs_household_id_idx on public.audit_logs(household_id);

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.delegates enable row level security;
alter table public.household_items enable row level security;
alter table public.tasks enable row level security;
alter table public.emergency_sessions enable row level security;
alter table public.audit_logs enable row level security;