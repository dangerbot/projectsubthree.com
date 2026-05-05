-- Project Sub Three — Supabase Schema
-- Run this in the Supabase SQL Editor (SQL icon in left sidebar)

-- ── Runners table ─────────────────────────────────────────────────────────────
-- One row per authenticated user. Context stored as JSONB.
-- Deleting a user in the Supabase dashboard cascades to their plans.

create table runners (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  context jsonb not null default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ── Plans table ───────────────────────────────────────────────────────────────
-- One active plan per runner. Full plan stored as JSONB.

create table plans (
  id uuid primary key default gen_random_uuid(),
  runner_id uuid not null references runners(id) on delete cascade,
  plan jsonb not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ── Row-Level Security ────────────────────────────────────────────────────────

alter table runners enable row level security;
alter table plans enable row level security;

-- Runners: users can only access their own row
create policy "runners_select_own" on runners
  for select using (auth.uid() = id);

create policy "runners_insert_own" on runners
  for insert with check (auth.uid() = id);

create policy "runners_update_own" on runners
  for update using (auth.uid() = id);

create policy "runners_delete_own" on runners
  for delete using (auth.uid() = id);

-- Plans: users can only access their own plans
create policy "plans_select_own" on plans
  for select using (runner_id = auth.uid());

create policy "plans_insert_own" on plans
  for insert with check (runner_id = auth.uid());

create policy "plans_update_own" on plans
  for update using (runner_id = auth.uid());

create policy "plans_delete_own" on plans
  for delete using (runner_id = auth.uid());

-- ── Auto-update timestamps ────────────────────────────────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger runners_updated_at
  before update on runners
  for each row execute function update_updated_at();

create trigger plans_updated_at
  before update on plans
  for each row execute function update_updated_at();
