create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text default 'unspecified',       -- 'creator' | 'ai_lab' | 'unspecified'
  created_at timestamptz not null default now()
);

alter table waitlist enable row level security;

-- No public policies are created on purpose: all inserts go through the
-- /api/waitlist route using the service role key, which bypasses RLS.

-- Extends content_records for the actual upload pipeline
alter table content_records
  add column if not exists creator_wallet text,
  add column if not exists storage_path text,
  add column if not exists media_subtype text,
  add column if not exists description text,
  add column if not exists file_iv text,
  add column if not exists file_auth_tag text;

-- Envelope-encrypted file keys, kept separate from content_records so
-- access to it can be locked down independently later (only released
-- once payment is confirmed on-chain — not wired up yet, this just
-- stores it safely for now).
create table if not exists content_keys (
  id uuid primary key default gen_random_uuid(),
  content_record_id uuid references content_records(id) on delete cascade unique,
  encrypted_key text not null,   -- the file's AES key, itself encrypted with MASTER_ENCRYPTION_KEY
  key_iv text not null,
  key_auth_tag text not null,
  created_at timestamptz not null default now()
);

alter table content_keys enable row level security;
-- No public policies — only the service role (server-side) can ever touch this table.

-- Ties a Supabase Auth user to a username and the wallet address they proved
-- ownership of at signup time. The wallet address is set once and never
-- changed by the app — it's the permanent creatorWallet used for uploads.
create table if not exists accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  wallet_address text not null unique,
  created_at timestamptz not null default now()
);

alter table accounts enable row level security;

-- Users can read their own account row (needed so the client can display
-- username/wallet address); all writes go through the service role key
-- in /api/auth/signup, never directly from the client.
create policy "Users can read own account" on accounts
  for select using (auth.uid() = id);

  alter table content_records
  add column onchain_registered boolean not null default false,
  add column onchain_tx_hash text;