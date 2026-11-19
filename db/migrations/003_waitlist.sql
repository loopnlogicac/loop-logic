-- Pro waitlist: emails of students who asked to hear when Pro opens.
-- Written only by the server (service role); readable by nobody else directly.
create table if not exists public.ll_waitlist (
  email       text primary key,
  plan        text not null default 'pro',
  lang        text not null default 'en',
  learner_id  text,
  created_at  timestamptz not null default now()
);
alter table public.ll_waitlist enable row level security;
grant select, insert, update, delete on public.ll_waitlist to service_role;
