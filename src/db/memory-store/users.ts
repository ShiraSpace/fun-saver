import type { AuthProvider, User } from '@/lib/user/types';
import { DuplicateUserError } from '@/lib/user/errors';
import type { UserRepository } from '../data-store';
import {
  userWithIdentity,
  isDuplicateUser,
  isKnownUser,
} from '../user-identity';

export class MemoryUsers implements UserRepository {
  private readonly users: User[] = [];

  async findByIdentity(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    return userWithIdentity(this.users, provider, providerAccountId);
  }

  isKnown(id: string): boolean {
    return isKnownUser(this.users, id);
  }

  async insert(user: User): Promise<void> {
    if (isDuplicateUser(this.users, user)) {
      throw new DuplicateUserError(user);
    }

    this.users.push(user);
  }
}
