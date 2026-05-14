-- IRONLOOP AI Supabase schema
-- Run in Supabase SQL editor or with: supabase db push

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

do $$ begin
  create type public.exam_track as enum ('CBSE', 'JEE', 'NEET', 'SAT', 'Olympiad', 'Other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.mistake_severity as enum ('low', 'medium', 'high', 'critical');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.mastery_level as enum ('new', 'learning', 'reviewing', 'mastered');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.revision_status as enum ('scheduled', 'in_progress', 'complete', 'missed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.file_kind as enum ('notes', 'paper', 'solution', 'revision', 'other');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  exam_track public.exam_track not null default 'CBSE',
  target_exam_date date,
  daily_study_goal_minutes integer not null default 300 check (daily_study_goal_minutes between 0 and 960),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  exam_track public.exam_track not null default 'CBSE',
  color text not null default '#22c7ff',
  priority integer not null default 3 check (priority between 1 and 5),
  syllabus_weight numeric(5,2) not null default 0 check (syllabus_weight >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name, exam_track)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  chapter text,
  duration_minutes integer not null check (duration_minutes > 0 and duration_minutes <= 960),
  focus_score integer not null default 75 check (focus_score between 0 and 100),
  session_date date not null default current_date,
  started_at timestamptz,
  ended_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  subject text not null,
  chapter text not null,
  mistake text not null,
  root_cause text not null,
  correct_concept text not null,
  severity public.mistake_severity not null default 'medium',
  mastery_level public.mastery_level not null default 'new',
  fixed boolean not null default false,
  mistake_date date not null default current_date,
  repeat_count integer not null default 1 check (repeat_count >= 1),
  tags text[] not null default '{}',
  search_document tsvector generated always as (
    to_tsvector(
      'english',
      coalesce(subject, '') || ' ' ||
      coalesce(chapter, '') || ' ' ||
      coalesce(mistake, '') || ' ' ||
      coalesce(root_cause, '') || ' ' ||
      coalesce(correct_concept, '') || ' ' ||
      coalesce(array_to_string(tags, ' '), '')
    )
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  subject text not null,
  chapter text not null,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  questions jsonb not null default '[]'::jsonb,
  score numeric(5,2) check (score is null or (score >= 0 and score <= 100)),
  generated_by_ai boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uploaded_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  storage_path text not null unique,
  subject text not null,
  chapter text,
  tags text[] not null default '{}',
  file_kind public.file_kind not null default 'notes',
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  mime_type text,
  search_document tsvector generated always as (
    to_tsvector(
      'english',
      coalesce(name, '') || ' ' ||
      coalesce(subject, '') || ' ' ||
      coalesce(chapter, '') || ' ' ||
      coalesce(array_to_string(tags, ' '), '')
    )
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.revision_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  mistake_id uuid references public.mistakes(id) on delete set null,
  subject text not null,
  chapter text not null,
  title text not null,
  due_at timestamptz not null,
  status public.revision_status not null default 'scheduled',
  priority integer not null default 3 check (priority between 1 and 5),
  estimated_minutes integer not null default 25 check (estimated_minutes between 5 and 240),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  metric_date date not null default current_date,
  study_minutes integer not null default 0 check (study_minutes >= 0),
  questions_attempted integer not null default 0 check (questions_attempted >= 0),
  accuracy numeric(5,2) check (accuracy is null or (accuracy >= 0 and accuracy <= 100)),
  mistakes_added integer not null default 0 check (mistakes_added >= 0),
  productivity_score integer check (productivity_score is null or (productivity_score between 0 and 100)),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, subject_id, metric_date)
);

create table if not exists public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  streak_type text not null check (streak_type in ('study', 'revision', 'mistake_fix', 'test')),
  current_count integer not null default 0 check (current_count >= 0),
  longest_count integer not null default 0 check (longest_count >= 0),
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, streak_type)
);

create table if not exists public.test_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  subject text not null,
  score numeric(7,2) not null check (score >= 0),
  max_score numeric(7,2) not null check (max_score > 0),
  test_date date not null default current_date,
  percentile numeric(5,2) check (percentile is null or (percentile between 0 and 100)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subjects_user_priority_idx on public.subjects(user_id, priority desc);
create index if not exists study_sessions_user_date_idx on public.study_sessions(user_id, session_date desc);
create index if not exists study_sessions_subject_idx on public.study_sessions(subject_id);
create index if not exists mistakes_user_date_idx on public.mistakes(user_id, mistake_date desc);
create index if not exists mistakes_user_subject_idx on public.mistakes(user_id, subject, chapter);
create index if not exists mistakes_user_fixed_idx on public.mistakes(user_id, fixed);
create index if not exists mistakes_user_severity_idx on public.mistakes(user_id, severity);
create index if not exists mistakes_search_idx on public.mistakes using gin(search_document);
create index if not exists mistakes_tags_idx on public.mistakes using gin(tags);
create index if not exists quizzes_user_created_idx on public.quizzes(user_id, created_at desc);
create index if not exists files_user_created_idx on public.uploaded_files(user_id, created_at desc);
create index if not exists files_search_idx on public.uploaded_files using gin(search_document);
create index if not exists revision_user_due_idx on public.revision_tasks(user_id, due_at asc);
create index if not exists revision_status_idx on public.revision_tasks(user_id, status);
create index if not exists analytics_user_date_idx on public.analytics(user_id, metric_date desc);
create index if not exists streaks_user_type_idx on public.streaks(user_id, streak_type);
create index if not exists test_scores_user_date_idx on public.test_scores(user_id, test_date desc);

create or replace view public.mistake_repeat_signals as
select
  user_id,
  lower(subject) as subject_key,
  lower(chapter) as chapter_key,
  lower(root_cause) as root_cause_key,
  count(*) as mistake_count,
  max(mistake_date) as latest_mistake_date,
  bool_or(not fixed) as has_open_mistake
from public.mistakes
group by user_id, lower(subject), lower(chapter), lower(root_cause)
having count(*) > 1;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.users.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.users.avatar_url),
    updated_at = now();

  insert into public.streaks (user_id, streak_type)
  values
    (new.id, 'study'),
    (new.id, 'revision'),
    (new.id, 'mistake_fix'),
    (new.id, 'test')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

do $$ declare
  target_table text;
begin
  foreach target_table in array array[
    'users',
    'subjects',
    'study_sessions',
    'mistakes',
    'quizzes',
    'uploaded_files',
    'revision_tasks',
    'analytics',
    'streaks',
    'test_scores'
  ]
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', target_table, target_table);
    execute format(
      'create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      target_table,
      target_table
    );
  end loop;
end $$;

alter table public.users enable row level security;
alter table public.subjects enable row level security;
alter table public.study_sessions enable row level security;
alter table public.mistakes enable row level security;
alter table public.quizzes enable row level security;
alter table public.uploaded_files enable row level security;
alter table public.revision_tasks enable row level security;
alter table public.analytics enable row level security;
alter table public.streaks enable row level security;
alter table public.test_scores enable row level security;

drop policy if exists "Users can read own profile" on public.users;
drop policy if exists "Users can update own profile" on public.users;
drop policy if exists "Subjects are user scoped" on public.subjects;
drop policy if exists "Study sessions are user scoped" on public.study_sessions;
drop policy if exists "Mistakes are user scoped" on public.mistakes;
drop policy if exists "Quizzes are user scoped" on public.quizzes;
drop policy if exists "Uploaded files are user scoped" on public.uploaded_files;
drop policy if exists "Revision tasks are user scoped" on public.revision_tasks;
drop policy if exists "Analytics are user scoped" on public.analytics;
drop policy if exists "Streaks are user scoped" on public.streaks;
drop policy if exists "Test scores are user scoped" on public.test_scores;

create policy "Users can read own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Subjects are user scoped" on public.subjects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Study sessions are user scoped" on public.study_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Mistakes are user scoped" on public.mistakes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Quizzes are user scoped" on public.quizzes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Uploaded files are user scoped" on public.uploaded_files for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Revision tasks are user scoped" on public.revision_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Analytics are user scoped" on public.analytics for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Streaks are user scoped" on public.streaks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Test scores are user scoped" on public.test_scores for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'study-files',
  'study-files',
  false,
  52428800,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg'
  ]
)
on conflict (id) do nothing;

drop policy if exists "Users can upload own study files" on storage.objects;
drop policy if exists "Users can read own study files" on storage.objects;
drop policy if exists "Users can update own study files" on storage.objects;
drop policy if exists "Users can delete own study files" on storage.objects;

create policy "Users can upload own study files"
on storage.objects for insert
with check (
  bucket_id = 'study-files'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can read own study files"
on storage.objects for select
using (
  bucket_id = 'study-files'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update own study files"
on storage.objects for update
using (
  bucket_id = 'study-files'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'study-files'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own study files"
on storage.objects for delete
using (
  bucket_id = 'study-files'
  and auth.uid()::text = (storage.foldername(name))[1]
);
