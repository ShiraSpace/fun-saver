CREATE TABLE IF NOT EXISTS accounts (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  theme_id  TEXT NOT NULL DEFAULT 'sunshine-quest',
  wallets   JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS transactions (
  id          TEXT PRIMARY KEY,
  wallet_id   TEXT NOT NULL,
  account_id  TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  amount      INTEGER NOT NULL,
  occurred_at TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS transactions_account_wallet_idx
  ON transactions(account_id, wallet_id);
