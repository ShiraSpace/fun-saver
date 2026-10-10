---
name: usage-stats
description: Use when asked how fun-saver is being used — how many users or accounts there are, which parents and children use it, sign-ups or activity this week or month, money deposited, interest paid, engagement. Runs a read-only SQL report against the production Neon database, publishes it as the Fun Saver Usage artifact with graphs, and summarises it.
---

# Usage stats

## Run

From the fun-saver root. `DATABASE_URL` is production; use `DEV_DATABASE_URL` only
when the user asks for dev.

```bash
DB=$(grep '^DATABASE_URL=' .env.local | cut -d= -f2- | tr -d "'\"")
OUT=<your scratchpad directory>
PGOPTIONS='-c default_transaction_read_only=on' psql "$DB" -X -q -At -v ON_ERROR_STOP=1 \
  -o "$OUT/usage-stats.json" -f .claude/skills/usage-stats/usage-stats.sql
sed -e '/__REPORT_DATA__/{' -e "r $OUT/usage-stats.json" -e 'd' -e '}' \
  .claude/skills/usage-stats/report.html > "$OUT/fun-saver-usage.html"
```

The session is read-only: never drop that flag, and never write to production
from this skill. `OUT` must be the scratchpad, because the Artifact tool only
publishes files from the scratchpad or the working directory.

## Publish

Publish `$OUT/fun-saver-usage.html` with the Artifact tool, passing
`url: https://claude.ai/artifact/FmbkxgAgNhgtSyrw21ENcn` so the same page is
updated and its link stays the same. Read it first (`action: "read"`) if this
conversation has not, as the tool requires.

Never edit the built page by hand. The page's layout lives in `report.html` and
its numbers come from `usage-stats.sql`, so every run looks the same. A change
to the report is a change to one of those two files.

The page holds parents' emails and children's names. It stays private; never
share it or publish it to a new URL.

## Report in chat

Read `$OUT/usage-stats.json` and give the link plus a short summary. Lead with
the all-time headline (users, accounts, manual transactions, total balance),
then recent activity, then anything notable: users with no account, accounts
never used, a week with no activity. Refer to accounts by their names; leave
emails to the page.

## Reading the numbers

- **Account opened** is the earliest wallet `openedAt`; `accounts` has no
  creation column. Accounts from before sign-in existed predate every user.
- **Manual transactions** are deposits and withdrawals. Interest is written by
  the app daily per savings wallet, so it is left out of activity counts.
- **Amounts** in the JSON are agorot, always positive in `transactions`; `type`
  gives the direction. The page shows shekels.
- **Balances** per wallet are the sum of that wallet's transactions, interest
  included. `balanceHistory` is the total at the end of each week.
- **Weeks** start Monday; `weekly` covers the last 12 weeks, `monthly` goes back
  to the first sign-up, account or transaction, and `balanceHistory` to the first
  transaction.
- **Used** on the page: this week (7 days), this month (30 days), quiet, or
  never used, from the last manual transaction.
