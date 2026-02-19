-- Create attachments table
create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('file', 'link')),
  name text not null,
  url text not null,
  file_size bigint,
  created_at timestamptz not null default now()
);

alter table public.attachments enable row level security;

create policy "attachments_select_own" on public.attachments for select using (auth.uid() = user_id);
create policy "attachments_insert_own" on public.attachments for insert with check (auth.uid() = user_id);
create policy "attachments_update_own" on public.attachments for update using (auth.uid() = user_id);
create policy "attachments_delete_own" on public.attachments for delete using (auth.uid() = user_id);
