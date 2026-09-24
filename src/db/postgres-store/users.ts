import type { AuthProvider, User } from '@/lib/types';
import { DuplicateUserError } from '@/lib/errors';
import type { UserRepository } from '../data-store';
import { userFromRow, type UserRow } from '../rows';
import { queryRows, type QueryParam, type Sql } from './query';

export class PostgresUsers implements UserRepository {
  constructor(private readonly sql: Sql) {}

  async findByIdentity(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    const rows = await this.query(
      'SELECT * FROM users WHERE provider = $1 AND provider_account_id = $2',
      [provider, providerAccountId]
    );

    return rows[0] ? userFromRow(rows[0]) : undefined;
  }

  async insert(user: User): Promise<void> {
    const inserted = await this.sql`
      INSERT INTO users (id, provider, provider_account_id, email, name, created_at)
      VALUES (
        ${user.id},
        ${user.provider},
        ${user.providerAccountId},
        ${user.email},
        ${user.name},
        ${user.createdAt}
      )
      ON CONFLICT DO NOTHING
      RETURNING id
    `;

    if (inserted.length === 0) {
      throw new DuplicateUserError(user);
    }
  }

  private query(text: string, params?: QueryParam[]): Promise<UserRow[]> {
    return queryRows<UserRow>(this.sql, text, params);
  }
}
