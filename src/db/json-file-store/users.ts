import type { AuthProvider, User } from '@/lib/types';
import { DuplicateUserError } from '@/lib/errors';
import type { UserRepository } from '../data-store';
import { userWithIdentity, isDuplicateUser } from '../user-identity';
import type { FileSession } from './file-session';

export class JsonUsers implements UserRepository {
  constructor(private readonly session: FileSession) {}

  findByIdentity(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    return this.session.read((data): User | undefined =>
      userWithIdentity(data.users, provider, providerAccountId)
    );
  }

  insert(user: User): Promise<void> {
    return this.session.write(async (data, save): Promise<void> => {
      if (isDuplicateUser(data.users, user)) {
        throw new DuplicateUserError(user);
      }
      data.users.push(user);
      await save();
    });
  }
}
