import { neon } from '@neondatabase/serverless';
import type { AccountUser } from '@/lib/types';
import { assignOwners } from './assign-owner';
import { requireTargetUrl, resolveTarget } from './migration-target';
import { selectRows, type Sql } from './postgres-store/query';
import {
  toAccount,
  toAccountUser,
  type AccountRow,
  type AccountUserRow,
  type UserRow,
} from './row-mappers';

const EMAIL_FLAG = '--email=';

async function main(): Promise<void> {
  const target = resolveTarget();
  const email = requireEmail();
  const sql = neon(requireTargetUrl(target));
  const userId = await findUserId(sql, email);

  const accounts = await selectRows<AccountRow>(sql, 'SELECT * FROM accounts');
  const accountUsers = await selectRows<AccountUserRow>(
    sql,
    'SELECT * FROM account_users'
  );

  const assigned = assignOwners({
    accounts: accounts.map(toAccount),
    accountUsers: accountUsers.map(toAccountUser),
    owner: { userId, addedAt: new Date().toISOString() },
  });

  await insertAccountUsers(sql, assigned);
  console.log(
    `Backfill complete (${target.name} branch): ${assigned.length} account(s) assigned to ${email}.`
  );
}

function requireEmail(): string {
  const flag = process.argv.find((arg) => arg.startsWith(EMAIL_FLAG));
  const email = flag?.slice(EMAIL_FLAG.length);

  if (!email) {
    throw new Error(`Pass the owner's address as ${EMAIL_FLAG}<address>`);
  }

  return email;
}

async function findUserId(sql: Sql, email: string): Promise<string> {
  const rows = await selectRows<UserRow>(
    sql,
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (rows.length === 0) {
    throw new Error(`No user has the email ${email} — sign in there first`);
  }

  if (rows.length > 1) {
    throw new Error(`${rows.length} users share the email ${email}`);
  }

  return rows[0].id;
}

async function insertAccountUsers(
  sql: Sql,
  accountUsers: AccountUser[]
): Promise<void> {
  if (accountUsers.length === 0) {
    return;
  }

  await sql.transaction(
    accountUsers.map((accountUser) =>
      sql.query(
        `INSERT INTO account_users (account_id, user_id, role, added_at)
         VALUES ($1, $2, $3, $4)`,
        [
          accountUser.accountId,
          accountUser.userId,
          accountUser.role,
          accountUser.addedAt,
        ]
      )
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
