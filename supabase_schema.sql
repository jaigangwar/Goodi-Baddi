-- Run these commands in your Supabase SQL Editor

-- 1. Create Companies Table
create table public.companies (
  id uuid references auth.users not null primary key,
  company_name text not null,
  hr_name text not null,
  email text not null unique,
  mobile text not null,
  linkedin_url text,
  status text default 'Pending' check (status in ('Pending', 'Verified', 'Rejected')),
  role text default 'Company' check (role in ('Company', 'Admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.companies enable row level security;
create policy "Public companies are viewable by everyone." on public.companies for select using (true);
create policy "Users can update own profile." on public.companies for update using (auth.uid() = id);

-- Trigger to create company profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.companies (id, company_name, hr_name, email, mobile, linkedin_url, status, role)
  values (
    new.id,
    COALESCE(new.raw_user_meta_data->>'companyName', new.raw_user_meta_data->>'full_name', 'My Company'),
    COALESCE(new.raw_user_meta_data->>'hrName', new.raw_user_meta_data->>'name', 'HR Admin'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'mobile', '0000000000'),
    new.raw_user_meta_data->>'linkedinUrl',
    'Pending',
    'Company'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Create Employees Table
create table public.employees (
  id uuid default gen_random_uuid() primary key,
  employee_name text not null,
  mobile text not null,
  email text not null,
  linkedin_url text,
  designation text not null,
  joining_date date,
  leaving_date date,
  reason_for_leaving text,
  employment_type text,
  company_id uuid references public.companies(id) not null,
  company_name text not null,
  rating numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.employees enable row level security;
create policy "Employees are viewable by authenticated users" on public.employees for select using (auth.role() = 'authenticated');
create policy "Companies can insert employees" on public.employees for insert with check (auth.uid() = company_id);
create policy "Companies can update their own inserted employees" on public.employees for update using (auth.uid() = company_id);

-- 3. Create Feedbacks Table
create table public.feedbacks (
  id uuid default gen_random_uuid() primary key,
  employee_id uuid references public.employees(id) on delete cascade not null,
  company_id uuid references public.companies(id) not null,
  company_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  positives jsonb default '[]'::jsonb,
  negatives jsonb default '[]'::jsonb,
  comments text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.feedbacks enable row level security;
create policy "Feedbacks viewable by authenticated users" on public.feedbacks for select using (auth.role() = 'authenticated');
create policy "Companies can insert feedback" on public.feedbacks for insert with check (auth.uid() = company_id);

-- Trigger to update employee average rating
create function public.update_employee_rating()
returns trigger as $$
begin
  update public.employees
  set rating = (
    select coalesce(avg(rating), 0) from public.feedbacks where employee_id = coalesce(new.employee_id, old.employee_id)
  )
  where id = coalesce(new.employee_id, old.employee_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger on_feedback_changed
  after insert or update or delete on public.feedbacks
  for each row execute procedure public.update_employee_rating();

-- 4. Create Reports Table
create table public.reports (
  id uuid default gen_random_uuid() primary key,
  reporter_id uuid references public.companies(id) not null,
  target_id uuid not null,
  target_type text not null check (target_type in ('Employee', 'Feedback', 'Company')),
  reason text not null,
  description text,
  status text default 'Pending' check (status in ('Pending', 'Resolved', 'Dismissed')),
  resolution text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.reports enable row level security;
create policy "Companies can insert reports" on public.reports for insert with check (auth.uid() = reporter_id);
create policy "Companies can view own reports" on public.reports for select using (auth.uid() = reporter_id);
create policy "Admins can view all reports" on public.reports for select using (
  exists (select 1 from public.companies where id = auth.uid() and role = 'Admin')
);
create policy "Admins can update reports" on public.reports for update using (
  exists (select 1 from public.companies where id = auth.uid() and role = 'Admin')
);
