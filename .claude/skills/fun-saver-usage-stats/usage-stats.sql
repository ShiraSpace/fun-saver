WITH
today AS (
  SELECT (now() AT TIME ZONE 'Asia/Jerusalem')::date AS day
),
account_opened AS (
  SELECT account.id, (SELECT min((wallet->>'openedAt')::date) FROM jsonb_array_elements(account.wallets) wallet) AS opened_on
  FROM accounts account
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
  SELECT account.id, account.name, account.is_active, account.theme_id, opened.opened_on,
    (SELECT coalesce(jsonb_agg(jsonb_build_object('email', parent.email, 'name', parent.name, 'role', account_user.role) ORDER BY account_user.added_at), '[]')
       FROM account_users account_user JOIN users parent ON parent.id = account_user.user_id
       WHERE account_user.account_id = account.id) AS parents,
    jsonb_build_object(
      'savings',   (SELECT coalesce(sum(balance_change), 0) FROM activity WHERE account_id = account.id AND wallet_id = 'savings'),
      'spending',  (SELECT coalesce(sum(balance_change), 0) FROM activity WHERE account_id = account.id AND wallet_id = 'spending'),
      'goodDeeds', (SELECT coalesce(sum(balance_change), 0) FROM activity WHERE account_id = account.id AND wallet_id = 'goodDeeds')
    ) AS balances,
    (SELECT coalesce(sum(amount) FILTER (WHERE type = 'deposit'), 0)    FROM activity WHERE account_id = account.id) AS deposited,
    (SELECT coalesce(sum(amount) FILTER (WHERE type = 'withdrawal'), 0) FROM activity WHERE account_id = account.id) AS withdrawn,
    (SELECT coalesce(sum(amount) FILTER (WHERE type = 'interest'), 0)   FROM activity WHERE account_id = account.id) AS interest_earned,
    (SELECT count(*) FROM manual WHERE account_id = account.id) AS manual_transactions,
    (SELECT max(occurred_on) FROM manual WHERE account_id = account.id) AS last_activity_on,
    (SELECT jsonb_build_object('name', goal.name, 'amount', goal.amount, 'startedOn', goal.started_at::date)
       FROM goals goal WHERE goal.account_id = account.id AND goal.ended_at IS NULL) AS goal
  FROM accounts account JOIN account_opened opened ON opened.id = account.id
),
account_usage AS (
  SELECT per_account.*,
    (SELECT day FROM today) - last_activity_on AS days_since_activity,
    CASE
      WHEN last_activity_on IS NULL                        THEN 'neverUsed'
      WHEN last_activity_on > (SELECT day FROM today) - 7  THEN 'thisWeek'
      WHEN last_activity_on > (SELECT day FROM today) - 30 THEN 'thisMonth'
      ELSE 'quiet'
    END AS used
  FROM per_account
)
SELECT replace(jsonb_pretty(jsonb_build_object(
  'generatedAt', to_char(now() AT TIME ZONE 'Asia/Jerusalem', 'YYYY-MM-DD HH24:MI'),
  'totals', jsonb_build_object(
    'users',               (SELECT count(*) FROM users),
    'accounts',            (SELECT count(*) FROM accounts),
    'activeAccounts',      (SELECT count(*) FROM accounts WHERE is_active),
    'sharedAccounts',      (SELECT count(*) FROM (SELECT account_id FROM account_users GROUP BY account_id HAVING count(*) > 1) shared),
    'usersWithoutAccount', (SELECT count(*) FROM users parent WHERE NOT EXISTS (SELECT 1 FROM account_users WHERE user_id = parent.id)),
    'manualTransactions',  (SELECT count(*) FROM manual),
    'deposited',           (SELECT coalesce(sum(amount), 0) FROM activity WHERE type = 'deposit'),
    'withdrawn',           (SELECT coalesce(sum(amount), 0) FROM activity WHERE type = 'withdrawal'),
    'interestPaid',        (SELECT coalesce(sum(amount), 0) FROM activity WHERE type = 'interest'),
    'totalBalance',        (SELECT coalesce(sum(balance_change), 0) FROM activity),
    'usedThisWeek',        (SELECT count(*) FROM account_usage WHERE used = 'thisWeek'),
    'usedThisMonth',       (SELECT count(*) FROM account_usage WHERE used IN ('thisWeek', 'thisMonth')),
    'neverUsed',           (SELECT count(*) FROM account_usage WHERE used = 'neverUsed')
  ),
  'accounts', (SELECT coalesce(jsonb_agg(jsonb_build_object(
      'name', name, 'isActive', is_active, 'themeId', theme_id, 'openedOn', opened_on,
      'parents', parents, 'balances', balances, 'deposited', deposited, 'withdrawn', withdrawn,
      'interestEarned', interest_earned, 'manualTransactions', manual_transactions,
      'lastActivityOn', last_activity_on, 'daysSinceActivity', days_since_activity, 'used', used, 'goal', goal
    ) ORDER BY last_activity_on DESC NULLS LAST, name), '[]') FROM account_usage),
  'usersWithoutAccount', (SELECT coalesce(jsonb_agg(jsonb_build_object('email', email, 'name', name, 'joinedOn', joined_on) ORDER BY joined_on), '[]')
    FROM user_joined parent WHERE NOT EXISTS (SELECT 1 FROM account_users WHERE user_id = parent.id)),
  'weekly', (SELECT coalesce(jsonb_agg(jsonb_build_object(
      'week', weeks.week,
      'newUsers',             (SELECT count(*) FROM user_joined WHERE date_trunc('week', joined_on) = weeks.week),
      'newAccounts',          (SELECT count(*) FROM account_opened WHERE date_trunc('week', opened_on) = weeks.week),
      'manualTransactions',   (SELECT count(*) FROM manual WHERE date_trunc('week', occurred_on) = weeks.week),
      'accountsWithActivity', (SELECT count(DISTINCT account_id) FROM manual WHERE date_trunc('week', occurred_on) = weeks.week)
    ) ORDER BY weeks.week), '[]') FROM weeks),
  'monthly', (SELECT coalesce(jsonb_agg(jsonb_build_object(
      'month', to_char(months.month, 'YYYY-MM'),
      'newUsers',             (SELECT count(*) FROM user_joined WHERE date_trunc('month', joined_on) = months.month),
      'newAccounts',          (SELECT count(*) FROM account_opened WHERE date_trunc('month', opened_on) = months.month),
      'manualTransactions',   (SELECT count(*) FROM manual WHERE date_trunc('month', occurred_on) = months.month),
      'accountsWithActivity', (SELECT count(DISTINCT account_id) FROM manual WHERE date_trunc('month', occurred_on) = months.month)
    ) ORDER BY months.month DESC), '[]') FROM months),
  'balanceHistory', (SELECT coalesce(jsonb_agg(jsonb_build_object(
      'week', history_weeks.week,
      'totalBalance', (SELECT coalesce(sum(balance_change), 0) FROM activity WHERE occurred_on < history_weeks.week + 7)
    ) ORDER BY history_weeks.week), '[]') FROM history_weeks)
)), '<', '<');
