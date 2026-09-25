import type { Transaction } from '@/lib/transaction/types';
import type { TransactionRepository } from '../data-store';
import { transactionFromRow, type TransactionRow } from '../rows';
import { queryRows, type QueryParam, type Sql } from './query';

const TRANSACTION_COLUMNS =
  'id, wallet_id, account_id, type, amount, occurred_at, created_at';

interface InsertValues {
  values: QueryParam[];
  placeholders: string;
}

function transactionValues(transaction: Transaction): QueryParam[] {
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

function placeholderTuple(cells: QueryParam[], offset: number): string {
  const slots = cells.map((_, i) => `$${offset + i + 1}`);
  return `(${slots.join(', ')})`;
}

function insertValues(transactions: Transaction[]): InsertValues {
  const values: QueryParam[] = [];
  const tuples: string[] = [];

  for (const transaction of transactions) {
    const cells = transactionValues(transaction);
    tuples.push(placeholderTuple(cells, values.length));
    values.push(...cells);
  }

  return { values, placeholders: tuples.join(', ') };
}

export class PostgresTransactions implements TransactionRepository {
  constructor(private readonly sql: Sql) {}

  async insert(transactions: Transaction[]): Promise<void> {
    if (transactions.length === 0) return;

    const { values, placeholders } = insertValues(transactions);

    await this.sql.query(
      `INSERT INTO transactions (${TRANSACTION_COLUMNS}) VALUES ${placeholders}
       ON CONFLICT (account_id, wallet_id, occurred_at) WHERE type = 'interest'
       DO NOTHING`,
      values
    );
  }

  async listByWallet(
    accountId: string,
    walletId: string
  ): Promise<Transaction[]> {
    const rows = await queryRows<TransactionRow>(
      this.sql,
      `SELECT * FROM transactions
       WHERE account_id = $1 AND wallet_id = $2
       ORDER BY occurred_at, created_at, id`,
      [accountId, walletId]
    );

    return rows.map(transactionFromRow);
  }

  async listByAccount(accountId: string): Promise<Transaction[]> {
    const rows = await queryRows<TransactionRow>(
      this.sql,
      `SELECT * FROM transactions
       WHERE account_id = $1
       ORDER BY occurred_at, created_at, id`,
      [accountId]
    );

    return rows.map(transactionFromRow);
  }
}
