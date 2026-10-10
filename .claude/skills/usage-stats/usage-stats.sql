WITH
account_opened AS (
  SELECT a.id, (SELECT min((w->>'openedAt')::date) FROM jsonb_array_elements(a.wallets) w) AS opened_on
  FROM accounts a
),
user_joined AS (
  SELECT id, email, name, created_at::timestamptz::date AS joined_on FROM users
),
activity AS (
  SELECT account_id, wallet_id, type, amount, occurred_at::date AS occurred_on,
         CASE WHEN type = 'withdrawal' THEN -amount ELSE amount END AS balance_change
  FROM transactions
),
manual AS (
  SELECT * FROM activity WHERE type <> 'interest'
),
weeks AS (
  SELECT generate_series(date_trunc('week', now()) - interval '11 weeks',
                         date_trunc('week', now()), '1 week')::date AS week
),
months AS (
  SELECT generate_series(date_trunc('month', least((SELECT min(occurred_on) FROM activity),
                                                   (SELECT min(joined_on) FROM user_joined),
                                                   (SELECT min(opened_on) FROM account_opened))),
                         date_trunc('month', now()), '1 month')::date AS month
),
history_weeks AS (
  SELECT generate_series(date_trunc('week', (SELECT min(occurred_on) FROM activity)),
                         date_trunc('week', now()), '1 week')::date AS week
),
per_account AS (
  SELECT a.id, a.name, a.is_active, a.view_mode, a.theme_id, o.opened_on,
    (SELECT coalesce(jsonb_agg(jsonb_build_object('email', u.email, 'name', u.name, 'role', au.role) ORDER BY au.added_at), '[]')
       FROM account_users au JOIN users u ON u.id = au.user_id WHERE au.account_id = a.id) AS parents,
    jsonb_build_object(
      'savings',   (SELECT coalesce(sum(balance_change), 0) FROM activity t WHERE t.account_id = a.id AND t.wallet_id = 'savings'),
      'spending',  (SELECT coalesce(sum(balance_change), 0) FROM activity t WHERE t.account_id = a.id AND t.wallet_id = 'spending'),
      'goodDeeds', (SELECT coalesce(sum(balance_change), 0) FROM activity t WHERE t.account_id = a.id AND t.wallet_id = 'goodDeeds')
    ) AS balances,
    (SELECT coalesce(sum(amount) FILTER (WHERE type = 'deposit'), 0)    FROM activity t WHERE t.account_id = a.id) AS deposited,
    (SELECT coalesce(sum(amount) FILTER (WHERE type = 'withdrawal'), 0) FROM activity t WHERE t.account_id = a.id) AS withdrawn,
    (SELECT coalesce(sum(amount) FILTER (WHERE type = 'interest'), 0)   FROM activity t WHERE t.account_id = a.id) AS interest_earned,
    (SELECT count(*) FROM manual t WHERE t.account_id = a.id) AS manual_transactions,
    (SELECT max(occurred_on) FROM manual t WHERE t.account_id = a.id) AS last_activity_on,
    (SELECT jsonb_build_object('name', g.name, 'amount', g.amount, 'startedOn', g.started_at::date)
       FROM goals g WHERE g.account_id = a.id AND g.ended_at IS NULL) AS goal
  FROM accounts a JOIN account_opened o ON o.id = a.id
)
SELECT replace(jsonb_pretty(jsonb_build_object(
  'generatedAt', to_char(now() AT TIME ZONE 'Asia/Jerusalem', 'YYYY-MM-DD HH24:MI'),
  'totals', jsonb_build_object(
    'users',               (SELECT count(*) FROM users),
    'accounts',            (SELECT count(*) FROM accounts),
    'activeAccounts',      (SELECT count(*) FROM accounts WHERE is_active),
    'sharedAccounts',      (SELECT count(*) FROM (SELECT account_id FROM account_users GROUP BY 1 HAVING count(*) > 1) s),
    'usersWithoutAccount', (SELECT count(*) FROM users u WHERE NOT EXISTS (SELECT 1 FROM account_users au WHERE au.user_id = u.id)),
    'manualTransactions',  (SELECT count(*) FROM manual),
    'deposited',           (SELECT coalesce(sum(amount), 0) FROM activity WHERE type = 'deposit'),
    'withdrawn',           (SELECT coalesce(sum(amount), 0) FROM activity WHERE type = 'withdrawal'),
    'interestPaid',        (SELECT coalesce(sum(amount), 0) FROM activity WHERE type = 'interest'),
    'totalBalance',        (SELECT coalesce(sum(balance_change), 0) FROM activity),
    'usedLast7Days',       (SELECT count(DISTINCT account_id) FROM manual WHERE occurred_on >= current_date - 7),
    'usedLast30Days',      (SELECT count(DISTINCT account_id) FROM manual WHERE occurred_on >= current_date - 30),
    'neverUsed',           (SELECT count(*) FROM accounts a WHERE NOT EXISTS (SELECT 1 FROM manual t WHERE t.account_id = a.id))
  ),
  'accounts', (SELECT coalesce(jsonb_agg(jsonb_build_object(
      'name', name, 'isActive', is_active, 'viewMode', view_mode, 'themeId', theme_id, 'openedOn', opened_on,
      'parents', parents, 'balances', balances, 'deposited', deposited, 'withdrawn', withdrawn,
      'interestEarned', interest_earned, 'manualTransactions', manual_transactions,
      'lastActivityOn', last_activity_on, 'goal', goal
    ) ORDER BY last_activity_on DESC NULLS LAST, name), '[]') FROM per_account),
  'usersWithoutAccount', (SELECT coalesce(jsonb_agg(jsonb_build_object('email', email, 'name', name, 'joinedOn', joined_on) ORDER BY joined_on), '[]')
    FROM user_joined u WHERE NOT EXISTS (SELECT 1 FROM account_users au WHERE au.user_id = u.id)),
  'weekly', (SELECT jsonb_agg(jsonb_build_object(
      'week', w.week,
      'newUsers',             (SELECT count(*) FROM user_joined WHERE date_trunc('week', joined_on) = w.week),
      'newAccounts',          (SELECT count(*) FROM account_opened WHERE date_trunc('week', opened_on) = w.week),
      'manualTransactions',   (SELECT count(*) FROM manual WHERE date_trunc('week', occurred_on) = w.week),
      'accountsWithActivity', (SELECT count(DISTINCT account_id) FROM manual WHERE date_trunc('week', occurred_on) = w.week)
    ) ORDER BY w.week) FROM weeks w),
  'monthly', (SELECT jsonb_agg(jsonb_build_object(
      'month', to_char(m.month, 'YYYY-MM'),
      'newUsers',             (SELECT count(*) FROM user_joined WHERE date_trunc('month', joined_on) = m.month),
      'newAccounts',          (SELECT count(*) FROM account_opened WHERE date_trunc('month', opened_on) = m.month),
      'manualTransactions',   (SELECT count(*) FROM manual WHERE date_trunc('month', occurred_on) = m.month),
      'accountsWithActivity', (SELECT count(DISTINCT account_id) FROM manual WHERE date_trunc('month', occurred_on) = m.month)
    ) ORDER BY m.month DESC) FROM months m),
  'balanceHistory', (SELECT jsonb_agg(jsonb_build_object(
      'week', h.week,
      'totalBalance', (SELECT coalesce(sum(balance_change), 0) FROM activity WHERE occurred_on < h.week + 7)
    ) ORDER BY h.week) FROM history_weeks h)
)), '<', '\u003c');
