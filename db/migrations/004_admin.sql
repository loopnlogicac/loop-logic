-- Admin site: one JSON document per row for courses, posts, ads, coupons,
-- members, roles and site settings, plus an append-only audit log.
-- Written only by the server (service role); readable by nobody else directly.
create table if not exists public.ll_docs (
  kind        text not null,
  id          text not null,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (kind, id)
);
create index if not exists ll_docs_kind_updated on public.ll_docs (kind, updated_at desc);
alter table public.ll_docs enable row level security;
grant select, insert, update, delete on public.ll_docs to service_role;

create table if not exists public.ll_audit (
  id      bigint generated always as identity primary key,
  at      timestamptz not null default now(),
  actor   text not null,
  action  text not null,
  target  text not null default '',
  detail  jsonb not null default '{}'::jsonb
);
create index if not exists ll_audit_at on public.ll_audit (at desc);
alter table public.ll_audit enable row level security;
grant select, insert on public.ll_audit to service_role;
