import type { AuthProvider, User } from '@/lib/types';
import type { UserRepository } from '../data-store';
import type { FileSession } from './file-session';

export class JsonUsers implements UserRepository {
  constructor(private readonly session: FileSession) {}

  findByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    return this.session.read((data): User | undefined =>
      data.users.find(
        (user) =>
          user.provider === provider &&
          user.providerAccountId === providerAccountId
      )
    );
  }

  insert(user: User): Promise<void> {
    return this.session.write(async (data, save): Promise<void> => {
      data.users.push(user);
      await save();
    });
  }
}
