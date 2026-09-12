import type { AuthProvider, User } from '@/lib/types';
import type { UserRepository } from '../data-store';

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
    this.users.push(user);
  }
}
