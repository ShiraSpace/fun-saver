---
name: usage-stats
description: Use when asked how fun-saver is being used — how many users or accounts there are, sign-ups or activity this week or month, money deposited, interest paid, engagement. Runs a read-only SQL report against the production Neon database and summarises it.
---

# Usage stats

## Run

From the fun-saver root. `DATABASE_URL` is production; use `DEV_DATABASE_URL` only
when the user asks for dev.

```bash
DB=$(grep '^DATABASE_URL=' .env.local | cut -d= -f2- | tr -d "'\"")
PGOPTIONS='-c default_transaction_read_only=on' psql "$DB" -X -q -v ON_ERROR_STOP=1 \
  -o "$TMPDIR/usage-stats.txt" -f .claude/skills/usage-stats/usage-stats.sql
```

Then Read `$TMPDIR/usage-stats.txt`. Output goes to a file because the terminal
filter truncates psql tables. The session is read-only: never drop that flag,
and never write to production from this skill.

## Report

Lead with the all-time headline (users, accounts, manual transactions, total
balance), then the monthly and weekly tables, then anything notable: users with
no account, accounts never used, a week with no activity.

## Reading the numbers

- **Account opened** is the earliest wallet `openedAt`; `accounts` has no
  creation column. Accounts from before sign-in existed predate every user.
- **Manual transactions** are deposits and withdrawals. Interest is written by
  the app daily per savings wallet, so it is left out of activity counts.
- **Amounts** are stored in agorot, always positive; `type` gives the direction.
  The report shows shekels.
- **Weeks** start Monday; the weekly table covers the last 12 weeks, the monthly
  one goes back to the first sign-up, account or transaction.
