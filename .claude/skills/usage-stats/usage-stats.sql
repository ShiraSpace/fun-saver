\pset footer off

\set account_opened '(SELECT a.id, a.theme_id, (SELECT min((w->>''openedAt'')::date) FROM jsonb_array_elements(a.wallets) w) AS opened_on FROM accounts a)'
\set user_joined '(SELECT id, created_at::timestamptz::date AS joined_on FROM users)'
\set activity '(SELECT account_id, type, amount, occurred_at::date AS occurred_on FROM transactions)'

\qecho '== All time'
SELECT
  (SELECT count(*) FROM users)                                   AS users,
  (SELECT count(*) FROM accounts)                                AS accounts,
  (SELECT count(*) FROM accounts WHERE is_active)                AS active_accounts,
  (SELECT round(count(*)::numeric / nullif((SELECT count(*) FROM users), 0), 2) FROM account_users) AS accounts_per_user,
  (SELECT count(*) FROM (SELECT account_id FROM account_users GROUP BY 1 HAVING count(*) > 1) s) AS shared_accounts,
  (SELECT count(*) FROM users u WHERE NOT EXISTS (SELECT 1 FROM account_users au WHERE au.user_id = u.id)) AS users_without_account,
  (SELECT count(*) FROM transactions WHERE type <> 'interest')   AS manual_transactions;

\qecho '== Money (shekels)'
SELECT
  round(sum(amount) FILTER (WHERE type = 'deposit')    / 100.0, 2) AS deposited,
  round(sum(amount) FILTER (WHERE type = 'withdrawal') / 100.0, 2) AS withdrawn,
  round(sum(amount) FILTER (WHERE type = 'interest')   / 100.0, 2) AS interest_paid,
  round(sum(CASE WHEN type = 'withdrawal' THEN -amount ELSE amount END) / 100.0, 2) AS total_balance
FROM transactions;

\qecho '== Transactions by type and wallet'
SELECT type, wallet_id, count(*), round(sum(amount) / 100.0, 2) AS shekels
FROM transactions GROUP BY 1, 2 ORDER BY 1, 2;

\qecho '== Monthly'
WITH months AS (
  SELECT generate_series(date_trunc('month', (SELECT min(occurred_at)::date FROM transactions)),
                         date_trunc('month', now()), '1 month')::date AS month
)
SELECT to_char(m.month, 'YYYY-MM') AS month,
  (SELECT count(*) FROM :user_joined AS user_joined    WHERE date_trunc('month', joined_on) = m.month) AS new_users,
  (SELECT count(*) FROM :account_opened AS account_opened WHERE date_trunc('month', opened_on) = m.month) AS new_accounts,
  (SELECT count(*) FROM :activity AS activity WHERE type <> 'interest' AND date_trunc('month', occurred_on) = m.month) AS manual_transactions,
  (SELECT count(DISTINCT account_id) FROM :activity AS activity WHERE type <> 'interest' AND date_trunc('month', occurred_on) = m.month) AS accounts_with_activity
FROM months m ORDER BY 1 DESC;

\qecho '== Weekly (weeks start Monday)'
WITH weeks AS (
  SELECT generate_series(date_trunc('week', now()) - interval '11 weeks',
                         date_trunc('week', now()), '1 week')::date AS week_start
)
SELECT weeks.week_start AS week,
  (SELECT count(*) FROM :user_joined AS user_joined    WHERE date_trunc('week', joined_on) = weeks.week_start) AS new_users,
  (SELECT count(*) FROM :account_opened AS account_opened WHERE date_trunc('week', opened_on) = weeks.week_start) AS new_accounts,
  (SELECT count(*) FROM :activity AS activity WHERE type <> 'interest' AND date_trunc('week', occurred_on) = weeks.week_start) AS manual_transactions,
  (SELECT count(DISTINCT account_id) FROM :activity AS activity WHERE type <> 'interest' AND date_trunc('week', occurred_on) = weeks.week_start) AS accounts_with_activity
FROM weeks ORDER BY 1 DESC;

\qecho '== Accounts per user'
SELECT accounts, count(*) AS users FROM (
  SELECT u.id, count(au.account_id) AS accounts
  FROM users u LEFT JOIN account_users au ON au.user_id = u.id GROUP BY u.id
) s GROUP BY 1 ORDER BY 1;

\qecho '== Roles'
SELECT role, count(*) FROM account_users GROUP BY 1 ORDER BY 2 DESC;

\qecho '== Themes'
SELECT theme_id, count(*) FROM accounts GROUP BY 1 ORDER BY 2 DESC;

\qecho '== Account engagement'
SELECT
  count(*) FILTER (WHERE last_manual IS NULL)                        AS never_used,
  count(*) FILTER (WHERE last_manual >= current_date - 7)            AS used_last_7_days,
  count(*) FILTER (WHERE last_manual >= current_date - 30)           AS used_last_30_days,
  round(avg(extract(day FROM now() - opened_on::timestamp)))         AS avg_age_days
FROM (
  SELECT o.id, o.opened_on,
         (SELECT max(occurred_on) FROM :activity AS t WHERE t.account_id = o.id AND t.type <> 'interest') AS last_manual
  FROM :account_opened AS o
) s;
