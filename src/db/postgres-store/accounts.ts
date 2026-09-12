import type { Account, AccountEdits } from '@/lib/types';
import type { ThemeId } from '@/theme/registry';
import type { AccountRepository } from '../data-store';
import { toAccount, type AccountRow } from '../row-mappers';
import { selectRows, type QueryParam, type Sql } from './query';

interface EditedColumns {
  assignments: string;
  values: QueryParam[];
}

function editedColumns(edits: AccountEdits): EditedColumns {
  const columns: string[] = [];
  const values: QueryParam[] = [];

  if (edits.name !== undefined) {
    columns.push('name');
    values.push(edits.name);
  }

  if (edits.avatarId !== undefined) {
    columns.push('avatar_id');
    values.push(edits.avatarId);
  }

  return {
    assignments: columns
      .map((column, index) => `${column} = $${index + 1}`)
      .join(', '),
    values,
  };
}

export class PostgresAccounts implements AccountRepository {
  constructor(private readonly sql: Sql) {}

  async insert(account: Account): Promise<void> {
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

  async list(): Promise<Account[]> {
    const rows = await this.select('SELECT * FROM accounts ORDER BY name');

    return rows.map(toAccount);
  }

  async get(id: string): Promise<Account | undefined> {
    const rows = await this.select('SELECT * FROM accounts WHERE id = $1', [
      id,
    ]);

    return rows[0] ? toAccount(rows[0]) : undefined;
  }

  async setTheme(id: string, themeId: ThemeId): Promise<Account | undefined> {
    const rows = await this.select(
      'UPDATE accounts SET theme_id = $1 WHERE id = $2 RETURNING *',
      [themeId, id]
    );

    return rows[0] ? toAccount(rows[0]) : undefined;
  }

  async update(id: string, edits: AccountEdits): Promise<Account | undefined> {
    const { assignments, values } = editedColumns(edits);

    if (values.length === 0) {
      return this.get(id);
    }

    const rows = await this.select(
      `UPDATE accounts SET ${assignments} WHERE id = $${values.length + 1} RETURNING *`,
      [...values, id]
    );

    return rows[0] ? toAccount(rows[0]) : undefined;
  }

  private select(text: string, params?: QueryParam[]): Promise<AccountRow[]> {
    return selectRows<AccountRow>(this.sql, text, params);
  }
}
