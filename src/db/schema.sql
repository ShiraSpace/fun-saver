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

CREATE TABLE IF NOT EXISTS users (
  id                  TEXT PRIMARY KEY,
  provider            TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  email               TEXT NOT NULL,
  name                TEXT NOT NULL,
  created_at          TEXT NOT NULL,
  UNIQUE (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS account_users (
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  added_at   TEXT NOT NULL,
  PRIMARY KEY (account_id, user_id)
);

CREATE INDEX IF NOT EXISTS account_users_user_idx ON account_users(user_id);
