-- Loop & Logic — Supabase schema (Postgres 15+), matching src/store/supabase.ts.
--
-- How to apply: Supabase dashboard → SQL editor → paste this file → Run.
-- STATUS: written for review; run the checks at the bottom after applying.
--
-- Design notes
-- - The server writes with the service-role key; browsers never write here.
-- - Records are stored as JSONB documents with indexed key columns, so the app
--   and the database cannot drift apart field by field.
-- - The sealed check stores NO answer keys anywhere: keys are derived from a
--   private seed inside src/assessment/vault.ts at grading time.
-- - Learner ids are text: a Supabase Auth user id when signed in, or an
--   anonymous demo id. RLS lets a signed-in learner read only their own rows.

create table if not exists public.ll_sessions (
  id          uuid primary key,
  learner_id  text not null,
  tenant_id   text not null default 'demo',
  phase       text not null check (phase in ('practice', 'assessment', 'complete')),
  revision    integer not null,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);
create index if not exists ll_sessions_learner on public.ll_sessions (learner_id);

-- Append-only evidence. No UPDATE/DELETE policies exist for any browser role.
create table if not exists public.ll_events (
  seq         bigserial primary key,
  id          uuid not null unique,
  session_id  uuid not null references public.ll_sessions(id) on delete cascade,
  learner_id  text not null,
  type        text not null check (type in ('attempt', 'help', 'transfer_opened', 'transfer_attempt', 'correction')),
  at          timestamptz not null,
  data        jsonb not null
);
create index if not exists ll_events_session on public.ll_events (session_id, seq);

create table if not exists public.ll_traces (
  session_id  uuid not null references public.ll_sessions(id) on delete cascade,
  attempt_id  uuid not null,
  data        jsonb not null,
  primary key (session_id, attempt_id)
);

create table if not exists public.ll_idempotency (
  key         text primary key,           -- "<sessionId>:<kind>:<clientKey>"
  session_id  uuid references public.ll_sessions(id) on delete cascade,
  response    jsonb not null,
  created_at  timestamptz not null default now()
);

create table if not exists public.ll_reading_events (
  id          uuid primary key,
  learner_id  text not null,
  lesson_id   text not null,
  block_id    text,
  type        text not null,
  payload     jsonb not null default '{}',
  at          timestamptz not null
);
create index if not exists ll_reading_learner on public.ll_reading_events (learner_id, at);

create table if not exists public.ll_profiles (
  learner_id  text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.ll_llm_calls (
  id            uuid primary key,
  purpose       text not null,
  provider      text not null,
  model         text not null,
  input_tokens  integer not null default 0,
  output_tokens integer not null default 0,
  cached        boolean not null default false,
  latency_ms    integer not null default 0,
  outcome       text not null,
  at            timestamptz not null
);

-- Atomic commit: session + its events + optional trace, with a revision check.
create or replace function public.ll_commit(p_session jsonb, p_expected integer, p_events jsonb, p_trace jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_revision integer;
begin
  select revision into current_revision
  from ll_sessions where id = (p_session->>'id')::uuid
  for update;

  if found and p_expected is not null and current_revision <> p_expected then
    raise exception 'stale_state' using errcode = 'P0001';
  end if;

  insert into ll_sessions (id, learner_id, tenant_id, phase, revision, data, updated_at)
  values (
    (p_session->>'id')::uuid,
    p_session->>'learnerId',
    coalesce(p_session->>'tenantId', 'demo'),
    p_session->>'phase',
    (p_session->>'revision')::integer,
    p_session,
    now()
  )
  on conflict (id) do update
    set phase = excluded.phase, revision = excluded.revision, data = excluded.data, updated_at = now();

  insert into ll_events (id, session_id, learner_id, type, at, data)
  select (e->>'id')::uuid, (e->>'sessionId')::uuid, e->>'learnerId', e->>'type', (e->>'at')::timestamptz, e
  from jsonb_array_elements(coalesce(p_events, '[]'::jsonb)) as e;

  if p_trace is not null and p_trace <> 'null'::jsonb then
    insert into ll_traces (session_id, attempt_id, data)
    values ((p_session->>'id')::uuid, (p_trace->>'attemptId')::uuid, p_trace)
    on conflict do nothing;
  end if;
end;
$$;

revoke execute on function public.ll_commit(jsonb, integer, jsonb, jsonb) from public, anon, authenticated;

-- Row-level security: browsers may only READ their own learning rows.
alter table public.ll_sessions       enable row level security;
alter table public.ll_events         enable row level security;
alter table public.ll_traces         enable row level security;
alter table public.ll_idempotency    enable row level security;
alter table public.ll_reading_events enable row level security;
alter table public.ll_profiles       enable row level security;
alter table public.ll_llm_calls      enable row level security;

drop policy if exists own_sessions on public.ll_sessions;
create policy own_sessions on public.ll_sessions for select to authenticated using (learner_id = auth.uid()::text);
drop policy if exists own_events on public.ll_events;
create policy own_events on public.ll_events for select to authenticated using (learner_id = auth.uid()::text);
drop policy if exists own_reading on public.ll_reading_events;
create policy own_reading on public.ll_reading_events for select to authenticated using (learner_id = auth.uid()::text);
drop policy if exists own_profile on public.ll_profiles;
create policy own_profile on public.ll_profiles for select to authenticated using (learner_id = auth.uid()::text);
-- ll_traces, ll_idempotency, ll_llm_calls: no policies → server (service role) only.

-- Checks to run after applying (SQL editor, "Run as" an authenticated test user):
-- 1. select count(*) from ll_sessions where learner_id <> auth.uid()::text;   → 0
-- 2. insert into ll_events (id, session_id, learner_id, type, at, data) values (...);  → denied by RLS
-- 3. select * from ll_llm_calls;                                               → 0 rows (no policy)
-- 4. select public.ll_commit('{}', null, '[]', null);                          → permission denied
