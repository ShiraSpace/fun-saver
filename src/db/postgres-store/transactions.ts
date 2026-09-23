import type { Transaction } from '@/lib/types';
import type { TransactionRepository } from '../data-store';
import { toTransaction, type TransactionRow } from '../row-mappers';
import { selectRows, type QueryParam, type Sql } from './query';

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

export class PostgresTransactions implements TransactionRepository {
  constructor(private readonly sql: Sql) {}

  async insert(transactions: Transaction[]): Promise<void> {
    if (transactions.length === 0) return;

    const { values, placeholders } = buildInsertBatch(transactions);

    await this.sql.query(
      `INSERT INTO transactions (${TRANSACTION_COLUMNS}) VALUES ${placeholders}`,
      values
    );
  }

  async listByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]> {
    const rows = await selectRows<TransactionRow>(
      this.sql,
      `SELECT * FROM transactions
       WHERE account_id = $1 AND wallet_id = $2
       ORDER BY occurred_at, created_at, id`,
      [accountId, walletId]
    );

    return rows.map(toTransaction);
  }

  async listByAccount(accountId: string): Promise<Transaction[]> {
    const rows = await selectRows<TransactionRow>(
      this.sql,
      `SELECT * FROM transactions
       WHERE account_id = $1
       ORDER BY occurred_at, created_at, id`,
      [accountId]
    );

    return rows.map(toTransaction);
  }
}
