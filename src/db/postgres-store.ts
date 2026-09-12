import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { Account, Transaction } from '@/lib/types';
import type { ThemeId } from '@/theme/registry';
import type { DataStore } from './data-store';
import {
  toAccount,
  toTransaction,
  type AccountRow,
  type TransactionRow,
} from './row-mappers';

type QueryParam = string | number | boolean | null;

const TRANSACTION_COLUMNS =
  'id, wallet_id, account_id, type, amount, occurred_at, created_at';

interface InsertBatch {
  values: QueryParam[];
  placeholders: string;
}

function transactionCells(transaction: Transaction): QueryParam[] {
  return [
    transaction.id,
    transaction.walletId,
    transaction.accountId,
    transaction.type,
    transaction.amount,
    transaction.occurredAt,
    transaction.createdAt,
  ];
}

function placeholderRow(cells: QueryParam[], offset: number): string {
  const slots = cells.map((_, i) => `$${offset + i + 1}`);
  return `(${slots.join(', ')})`;
}

function buildInsertBatch(transactions: Transaction[]): InsertBatch {
  const values: QueryParam[] = [];
  const rows: string[] = [];

  for (const transaction of transactions) {
    const cells = transactionCells(transaction);
    rows.push(placeholderRow(cells, values.length));
    values.push(...cells);
  }

  return { values, placeholders: rows.join(', ') };
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
    const rows = await this.selectRows<AccountRow>(
      'SELECT * FROM accounts ORDER BY name'
    );

    return rows.map(toAccount);
  }

  async getAccount(id: string): Promise<Account | undefined> {
    const rows = await this.selectRows<AccountRow>(
      'SELECT * FROM accounts WHERE id = $1',
      [id]
    );

    return rows[0] ? toAccount(rows[0]) : undefined;
  }

  async setAccountTheme(
    id: string,
    themeId: ThemeId
  ): Promise<Account | undefined> {
    const rows = await this.selectRows<AccountRow>(
      'UPDATE accounts SET theme_id = $1 WHERE id = $2 RETURNING *',
      [themeId, id]
    );

    return rows[0] ? toAccount(rows[0]) : undefined;
  }

  async insertTransactions(transactions: Transaction[]): Promise<void> {
    if (transactions.length === 0) return;

    const { values, placeholders } = buildInsertBatch(transactions);

    await this.sql.query(
      `INSERT INTO transactions (${TRANSACTION_COLUMNS}) VALUES ${placeholders}`,
      values
    );
  }

  async listTransactionsByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]> {
    const rows = await this.selectRows<TransactionRow>(
      `SELECT * FROM transactions
       WHERE account_id = $1 AND wallet_id = $2
       ORDER BY occurred_at, created_at, id`,
      [accountId, walletId]
    );

    return rows.map(toTransaction);
  }

  private async selectRows<Row>(
    text: string,
    params?: QueryParam[]
  ): Promise<Row[]> {
    const rows = await this.sql.query(text, params);
    return rows as Row[];
  }
}
