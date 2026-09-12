import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { Account, Transaction, Wallet } from '@/lib/types';
import type { ThemeId } from '@/theme/registry';
import type { DataStore } from './data-store';

interface AccountRow {
  id: string;
  name: string;
  avatar_id: string;
  is_active: boolean;
  theme_id: string;
  wallets: unknown;
}

interface TransactionRow {
  id: string;
  wallet_id: string;
  account_id: string;
  type: string;
  amount: number;
  occurred_at: string;
  created_at: string;
}

function toAccount(row: AccountRow): Account {
  return {
    id: row.id,
    name: row.name,
    avatarId: row.avatar_id,
    isActive: row.is_active,
    themeId: row.theme_id as ThemeId,
    wallets: row.wallets as Wallet[],
  };
}

function toTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    walletId: row.wallet_id,
    accountId: row.account_id,
    type: row.type as Transaction['type'],
    amount: row.amount,
    occurredAt: row.occurred_at,
    createdAt: row.created_at,
  };
}

export class PostgresStore implements DataStore {
  private readonly sql: NeonQueryFunction<false, false>;

  constructor(databaseUrl: string) {
    this.sql = neon(databaseUrl);
  }

  async insertAccount(account: Account): Promise<void> {
    await this.sql`
      INSERT INTO accounts (id, name, avatar_id, is_active, theme_id, wallets)
      VALUES (
        ${account.id},
        ${account.name},
        ${account.avatarId},
        ${account.isActive},
        ${account.themeId},
        ${JSON.stringify(account.wallets)}::jsonb
      )
    `;
  }

  async listAccounts(): Promise<Account[]> {
    const rows = (await this
      .sql`SELECT * FROM accounts ORDER BY name`) as AccountRow[];
    return rows.map(toAccount);
  }

  async getAccount(id: string): Promise<Account | undefined> {
    const rows = (await this
      .sql`SELECT * FROM accounts WHERE id = ${id}`) as AccountRow[];
    return rows[0] ? toAccount(rows[0]) : undefined;
  }

  async setAccountTheme(
    id: string,
    themeId: ThemeId
  ): Promise<Account | undefined> {
    const rows = (await this.sql`
      UPDATE accounts SET theme_id = ${themeId} WHERE id = ${id} RETURNING *
    `) as AccountRow[];
    return rows[0] ? toAccount(rows[0]) : undefined;
  }

  async insertTransactions(transactions: Transaction[]): Promise<void> {
    if (transactions.length === 0) return;

    const columnsPerRow = 7;
    const rowPlaceholders = transactions
      .map((_, rowIdx) => {
        const cells = Array.from({ length: columnsPerRow }, (_, colIdx) => {
          return `$${rowIdx * columnsPerRow + colIdx + 1}`;
        });
        return `(${cells.join(', ')})`;
      })
      .join(', ');

    const values = transactions.flatMap((transaction) => [
      transaction.id,
      transaction.walletId,
      transaction.accountId,
      transaction.type,
      transaction.amount,
      transaction.occurredAt,
      transaction.createdAt,
    ]);

    await this.sql.query(
      `INSERT INTO transactions (id, wallet_id, account_id, type, amount, occurred_at, created_at) VALUES ${rowPlaceholders}`,
      values
    );
  }

  async listTransactionsByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]> {
    const rows = (await this.sql`
      SELECT * FROM transactions
      WHERE account_id = ${accountId} AND wallet_id = ${walletId}
      ORDER BY occurred_at
    `) as TransactionRow[];
    return rows.map(toTransaction);
  }
}
