import type { AuthProvider, User } from '@/lib/types';
import { DuplicateUserError } from '@/lib/errors';
import type { UserRepository } from '../data-store';
import { findUserByIdentity, isKnownUser } from '../user-identity';

export class MemoryUsers implements UserRepository {
  private readonly users: User[] = [];

  async findByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    return findUserByIdentity(this.users, provider, providerAccountId);
  }

  isKnown(id: string): boolean {
    return isKnownUser(this.users, id);
  }

  async insert(user: User): Promise<void> {
    if (await this.findByProvider(user.provider, user.providerAccountId)) {
      throw new DuplicateUserError(user);
    }

    this.users.push(user);
  }
}
