import type { AuthProvider, User } from '@/lib/types';
import type { UserRepository } from '../data-store';
import type { FileSession } from './file-session';
import { DuplicateUserError } from '@/lib/errors';

function findUser(
  users: User[],
  provider: AuthProvider,
  providerAccountId: string
): User | undefined {
  return users.find(
    (user) =>
      user.provider === provider && user.providerAccountId === providerAccountId
  );
}

export class JsonUsers implements UserRepository {
  constructor(private readonly session: FileSession) {}

  findByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    return this.session.read((data): User | undefined =>
      findUser(data.users, provider, providerAccountId)
    );
  }

  insert(user: User): Promise<void> {
    return this.session.write(async (data, save): Promise<void> => {
      if (findUser(data.users, user.provider, user.providerAccountId)) {
        throw new DuplicateUserError(user);
      }
      data.users.push(user);
      await save();
    });
  }
}
