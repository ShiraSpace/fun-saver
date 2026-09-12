import type { AuthProvider, User } from '@/lib/types';
import type { UserRepository } from '../data-store';
import { toUser, type UserRow } from '../row-mappers';
import { selectRows, type QueryParam, type Sql } from './query';

export class PostgresUsers implements UserRepository {
  constructor(private readonly sql: Sql) {}

  async findByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    const rows = await this.select(
      'SELECT * FROM users WHERE provider = $1 AND provider_account_id = $2',
      [provider, providerAccountId]
    );

    return rows[0] ? toUser(rows[0]) : undefined;
  }

  async insert(user: User): Promise<void> {
    await this.sql`
      INSERT INTO users (id, provider, provider_account_id, email, name, created_at)
      VALUES (
        ${user.id},
        ${user.provider},
        ${user.providerAccountId},
        ${user.email},
        ${user.name},
        ${user.createdAt}
      )
    `;
  }

  private select(text: string, params?: QueryParam[]): Promise<UserRow[]> {
    return selectRows<UserRow>(this.sql, text, params);
  }
}
