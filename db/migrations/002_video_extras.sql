-- Instructor-written extras per YouTube video: materials, quiz, Try now.
-- Written only by the server (service role); readable by nobody else directly.
create table if not exists public.ll_video_extras (
  video_id    text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);
alter table public.ll_video_extras enable row level security;
