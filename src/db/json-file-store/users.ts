import type { AuthProvider, User } from '@/lib/user/types';
import { DuplicateUserError } from '@/lib/user/errors';
import type { UserRepository } from '../data-store';
import { userWithIdentity, isDuplicateUser } from '../user-identity';
import type { FileSession } from './file-session';

export class JsonUsers implements UserRepository {
  constructor(private readonly session: FileSession) {}

  findByIdentity(
    provider: AuthProvider,
    providerAccountId: string
  ): Promise<User | undefined> {
    return this.session.read((contents): User | undefined =>
      userWithIdentity(contents.users, provider, providerAccountId)
    );
  }

  insert(user: User): Promise<void> {
    return this.session.write(async (contents, save): Promise<void> => {
      if (isDuplicateUser(contents.users, user)) {
        throw new DuplicateUserError(user);
      }
      contents.users.push(user);
      await save();
    });
  }
}
