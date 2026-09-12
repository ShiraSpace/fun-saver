DROP TABLE IF EXISTS wallets CASCADE;

CREATE TABLE IF NOT EXISTS accounts (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  theme_id  TEXT NOT NULL DEFAULT 'sunshine-quest',
  wallets   JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE accounts DROP COLUMN IF EXISTS user_id;

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS wallets JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS transactions (
  id          TEXT PRIMARY KEY,
  wallet_id   TEXT NOT NULL,
  account_id  TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  amount      INTEGER NOT NULL,
  occurred_at TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS created_at TEXT;

CREATE INDEX IF NOT EXISTS transactions_wallet_idx ON transactions(wallet_id);
