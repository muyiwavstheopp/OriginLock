create table license_events (
  id uuid primary key default gen_random_uuid(),
  content_record_id uuid not null references content_records(id),
  content_hash text not null,              -- redundant copy, so this row is self-contained even if content_records changes later
  creator_wallet text not null,
  lab_wallet text not null,
  price_per_use text not null,             -- snapshot of terms AT THIS MOMENT, not a live reference
  currency text not null default 'USDC',
  license_scope text,                      -- e.g. "training", "fine-tuning", "commercial-model"
  onchain_tx_hash text not null,            -- the settlement transaction, so this is independently verifiable
  block_number bigint not null,
  created_at timestamptz not null default now()
);

create index on license_events (content_hash);
create index on license_events (lab_wallet);
create index on license_events (creator_wallet);