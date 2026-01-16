-- TRAINING PLANS (The high-level container, e.g. "Hypertrophy Phase 1")
create table public.training_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRAINING DAYS (The split, e.g. "Treino A", "Treino B")
create table public.training_days (
  id uuid default uuid_generate_v4() primary key,
  plan_id uuid references public.training_plans(id) on delete cascade not null,
  name text not null, -- "Treino A", "Push", "Legs"
  order_index int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRAINING ITEMS (The actual prescription)
create table public.training_items (
  id uuid default uuid_generate_v4() primary key,
  training_day_id uuid references public.training_days(id) on delete cascade not null,
  
  -- We link to the exercise library
  exercise_id uuid references public.exercises(id),
  
  -- Or allow custom text if not in library (optional, but good for flexibility)
  custom_exercise_name text,

  section text not null, -- 'technique', 'strength', 'accessory', 'auxiliary', 'conditioning'
  
  sets text, -- Text to allow "3-4" or "AMRAP"
  reps text, -- Text to allow ranges "8-12"
  notes text, 
  
  order_index int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.training_plans enable row level security;
alter table public.training_days enable row level security;
alter table public.training_items enable row level security;

-- Policies
create policy "Users can view own plans." on public.training_plans for select using (auth.uid() = user_id);
create policy "Users can insert own plans." on public.training_plans for insert with check (auth.uid() = user_id);
create policy "Users can update own plans." on public.training_plans for update using (auth.uid() = user_id);
create policy "Users can delete own plans." on public.training_plans for delete using (auth.uid() = user_id);

-- For Days/Items, check via plan -> user_id
create policy "Users can view own plan days." on public.training_days for select using (
  exists ( select 1 from public.training_plans where id = training_days.plan_id and user_id = auth.uid() )
);
create policy "Users can insert own plan days." on public.training_days for insert with check (
  exists ( select 1 from public.training_plans where id = training_days.plan_id and user_id = auth.uid() )
);
create policy "Users can update own plan days." on public.training_days for update using (
  exists ( select 1 from public.training_plans where id = training_days.plan_id and user_id = auth.uid() )
);
create policy "Users can delete own plan days." on public.training_days for delete using (
  exists ( select 1 from public.training_plans where id = training_days.plan_id and user_id = auth.uid() )
);

create policy "Users can view own training items." on public.training_items for select using (
  exists ( 
    select 1 from public.training_days d
    join public.training_plans p on p.id = d.plan_id
    where d.id = training_items.training_day_id and p.user_id = auth.uid() 
  )
);
create policy "Users can insert own training items." on public.training_items for insert with check (
  exists ( 
    select 1 from public.training_days d
    join public.training_plans p on p.id = d.plan_id
    where d.id = training_items.training_day_id and p.user_id = auth.uid() 
  )
);
create policy "Users can update own training items." on public.training_items for update using (
  exists ( 
    select 1 from public.training_days d
    join public.training_plans p on p.id = d.plan_id
    where d.id = training_items.training_day_id and p.user_id = auth.uid() 
  )
);
create policy "Users can delete own training items." on public.training_items for delete using (
  exists ( 
    select 1 from public.training_days d
    join public.training_plans p on p.id = d.plan_id
    where d.id = training_items.training_day_id and p.user_id = auth.uid() 
  )
);
