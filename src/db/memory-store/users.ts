import type { AuthProvider, User } from '@/lib/types';
import { DuplicateUserError } from '@/lib/errors';
import type { UserRepository } from '../data-store';
import { findUserByIdentity } from '../user-identity';

export class MemoryUsers implements UserRepository {
  private readonly users: User[] = [];

  async findByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    return findUserByIdentity(this.users, provider, providerAccountId);
  }

  async insert(user: User): Promise<void> {
    if (await this.findByProvider(user.provider, user.providerAccountId)) {
      throw new DuplicateUserError(user);
    }
    this.users.push(user);
  }
}
