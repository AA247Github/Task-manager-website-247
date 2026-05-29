-- Add reminder fields to tasks
-- reminder_lead_minutes: how many minutes before due_date to send a reminder (null = no reminder)
-- reminder_sent_at: timestamp the email reminder was sent, so the cron does not resend
alter table public.tasks
  add column if not exists reminder_lead_minutes integer,
  add column if not exists reminder_sent_at timestamptz;

-- Index to make the cron query (find tasks needing a reminder) efficient
create index if not exists tasks_reminder_idx
  on public.tasks (due_date)
  where reminder_lead_minutes is not null and reminder_sent_at is null;
