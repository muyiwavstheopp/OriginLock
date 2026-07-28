create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text default 'unspecified',       -- 'creator' | 'ai_lab' | 'unspecified'
  created_at timestamptz not null default now()
);

alter table waitlist enable row level security;

-- No public policies are created on purpose: all inserts go through the
-- /api/waitlist route using the service role key, which bypasses RLS.