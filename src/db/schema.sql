CREATE TABLE IF NOT EXISTS accounts (
  id        TEXT PRIMARY KEY,
  user_id   TEXT NOT NULL,
  name      TEXT NOT NULL,
  avatar_id TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  theme_id  TEXT NOT NULL DEFAULT 'sunshine-quest'
);

CREATE TABLE IF NOT EXISTS wallets (
  id                    TEXT PRIMARY KEY,
  account_id            TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  icon                  TEXT NOT NULL,
  monthly_interest_rate NUMERIC(6,4) NOT NULL DEFAULT 0,
  opened_at             TEXT NOT NULL,
  last_interest_date    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id          TEXT PRIMARY KEY,
  wallet_id   TEXT NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  account_id  TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  amount      INTEGER NOT NULL,
  occurred_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS transactions_wallet_idx ON transactions(wallet_id);