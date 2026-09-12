import type { AuthProvider, User } from '@/lib/types';
import { DuplicateUserError } from '@/lib/errors';
import type { UserRepository } from '../data-store';
import { findUserByIdentity } from '../user-identity';
import type { FileSession } from './file-session';

export class JsonUsers implements UserRepository {
  constructor(private readonly session: FileSession) {}

  findByProvider(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    return this.session.read((data): User | undefined =>
      findUserByIdentity(data.users, provider, providerAccountId)
    );
  }

  insert(user: User): Promise<void> {
    return this.session.write(async (data, save): Promise<void> => {
      if (
        findUserByIdentity(data.users, user.provider, user.providerAccountId)
      ) {
        throw new DuplicateUserError(user);
      }
      data.users.push(user);
      await save();
    });
  }
}
