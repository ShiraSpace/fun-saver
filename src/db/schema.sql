DROP TABLE IF EXISTS wallets CASCADE;

CREATE TABLE IF NOT EXISTS accounts (
  id        TEXT PRIMARY KEY,
  user_id   TEXT,
  name      TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  theme_id  TEXT NOT NULL DEFAULT 'sunshine-quest',
  wallets   JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE accounts ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS wallets JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS transactions (
  id          TEXT PRIMARY KEY,
  wallet_id   TEXT NOT NULL,
  account_id  TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  amount      INTEGER NOT NULL,
  occurred_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS transactions_wallet_idx ON transactions(wallet_id);
