-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Public user data)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  level text check (level in ('beginner', 'intermediate', 'advanced')),
  goal text check (goal in ('strength', 'conditioning', 'aesthetics', 'general')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MOVEMENT PATTERNS (Core of the system)
create table public.movement_patterns (
  code text primary key, -- PV, PH, EV, EH, DQB, DQU, DSB, DSU, CORE, COND
  name text not null,
  description text
);

insert into public.movement_patterns (code, name, description) values
('PV', 'Push Vertical', 'Empurrar na vertical'),
('PH', 'Push Horizontal', 'Empurrar na horizontal'),
('EV', 'Pull Vertical', 'Puxar na vertical'),
('EH', 'Pull Horizontal', 'Puxar na horizontal'),
('DQB', 'Dominante de Quadril Bilateral', 'Deadlift, Swing, etc.'),
('DQU', 'Dominante de Quadril Unilateral', 'Single leg deadlift, etc.'),
('DSB', 'Dominante de Joelho Bilateral', 'Squat, etc.'),
('DSU', 'Dominante de Joelho Unilateral', 'Lunge, Split Squat, etc.'),
('CORE', 'Core', 'Abdominal, lombar, estabilização'),
('COND', 'Condicionamento', 'Cardio, corrida, remo, etc.');

-- EXERCISES
create table public.exercises (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  equipment text[], -- 'barbell', 'dumbbell', 'kettlebell', 'bodyweight', 'machine'
  category text check (category in ('strength', 'gymnastics', 'conditioning', 'mobility')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- EXERCISE PATTERNS (Many-to-Many)
create table public.exercise_patterns (
  exercise_id uuid references public.exercises(id) on delete cascade,
  pattern_code text references public.movement_patterns(code) on delete cascade,
  primary key (exercise_id, pattern_code)
);

-- WOD LIBRARY (Benchmarks, Heroes)
create table public.wod_library (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  type text, -- 'AMRAP', 'EMOM', 'For Time', 'Hero', 'Girl'
  movements text[], -- List of movement names purely for display/search
  scoring_type text, -- 'time', 'rounds', 'load'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WORKOUTS (Logs)
create table public.workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text, -- Optional custom name
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text,
  status text default 'completed' check (status in ('planned', 'in_progress', 'completed')),
  
  -- If it was based on a WOD/Template
  wod_id uuid references public.wod_library(id),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- WORKOUT ITEMS (Sets/Reps for strength or details)
create table public.workout_items (
  id uuid default uuid_generate_v4() primary key,
  workout_id uuid references public.workouts(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id),
  
  -- For strength sets
  sets int,
  reps int,
  weight numeric, -- in kg
  
  -- For intervals/time
  duration_seconds int,
  distance_meters int,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PERSONAL RECORDS
create table public.personal_records (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete cascade not null,
  one_rep_max numeric,
  three_rep_max numeric,
  five_rep_max numeric,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY
alter table public.profiles enable row level security;
alter table public.movement_patterns enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_patterns enable row level security;
alter table public.wod_library enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_items enable row level security;
alter table public.personal_records enable row level security;

-- POLICIES

-- Profiles: Public read, Self update
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Reference Tables: Read only for everyone
create policy "Patterns are viewable by everyone." on public.movement_patterns for select using (true);
create policy "Exercises are viewable by everyone." on public.exercises for select using (true);
create policy "Exercise Patterns are viewable by everyone." on public.exercise_patterns for select using (true);
create policy "WODs are viewable by everyone." on public.wod_library for select using (true);

-- User Data: Self read/write
create policy "Users can view own workouts." on public.workouts for select using (auth.uid() = user_id);
create policy "Users can insert own workouts." on public.workouts for insert with check (auth.uid() = user_id);
create policy "Users can update own workouts." on public.workouts for update using (auth.uid() = user_id);

create policy "Users can view own workout items." on public.workout_items for select using (
  exists ( select 1 from public.workouts where id = workout_items.workout_id and user_id = auth.uid() )
);
create policy "Users can insert own workout items." on public.workout_items for insert with check (
  exists ( select 1 from public.workouts where id = workout_items.workout_id and user_id = auth.uid() )
);

create policy "Users can view own PRs." on public.personal_records for select using (auth.uid() = user_id);
create policy "Users can insert own PRs." on public.personal_records for insert with check (auth.uid() = user_id);
create policy "Users can update own PRs." on public.personal_records for update using (auth.uid() = user_id);

-- TRIGGER: Create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
