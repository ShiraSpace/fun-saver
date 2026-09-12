import type { AuthProvider, User } from '@/lib/types';
import type { UserRepository } from '../data-store';
import { DuplicateUserError } from '@/lib/errors';

export class MemoryUsers implements UserRepository {
  private readonly users: User[] = [];

  async findByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    return this.users.find(
      (user) =>
        user.provider === provider &&
        user.providerAccountId === providerAccountId
    );
  }

  async insert(user: User): Promise<void> {
    if (await this.findByProvider(user.provider, user.providerAccountId)) {
      throw new DuplicateUserError(user);
    }
    this.users.push(user);
  }
}
