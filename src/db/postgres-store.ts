import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { Account, Transaction, Wallet } from '@/lib/types';
import type { ThemeId } from '@/theme/registry';
import type { BuildGuardedTransaction, DataStore } from './data-store';

interface AccountRow {
  id: string;
  user_id: string | null;
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
    for (const transaction of transactions) {
      await this.sql`
        INSERT INTO transactions (id, wallet_id, account_id, type, amount, occurred_at)
        VALUES (
          ${transaction.id},
          ${transaction.walletId},
          ${transaction.accountId},
          ${transaction.type},
          ${transaction.amount},
          ${transaction.occurredAt}
        )
      `;
    }
  }

  async listTransactionsByWallet(walletId: string): Promise<Transaction[]> {
    const rows = (await this.sql`
      SELECT * FROM transactions WHERE wallet_id = ${walletId} ORDER BY occurred_at
    `) as TransactionRow[];
    return rows.map(toTransaction);
  }

  // Intentional design decision: read existing transactions, run build() in JS,
  // then insert. A tiny race window exists between the read and the insert where two
  // concurrent writers could both pass a balance check before either row lands.
  // Accepted for fun-saver's family scope — concurrent writes on the same wallet in
  // the same millisecond are effectively impossible. If concurrency grows, wrap this
  // in a real transaction with SELECT ... FOR UPDATE (needs Pool, not the HTTP driver).
  async insertTransactionWithGuard(
    walletId: string,
    build: BuildGuardedTransaction
  ): Promise<Transaction> {
    const existing = await this.listTransactionsByWallet(walletId);
    const transaction = build(existing);
    await this.insertTransactions([transaction]);
    return transaction;
  }
}
