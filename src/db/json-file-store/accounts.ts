import type { Account, AccountEdits } from '@/lib/account/types';
import { DuplicateAccountError } from '@/lib/account/errors';
import type { ThemeId } from '@/theme/registry';
import type { AccountRepository, StoreContents } from '../data-store';
import type { FileSession } from './file-session';

export function findAccount(
  contents: StoreContents,
  id: string
): Account | undefined {
  return contents.accounts.find((account) => account.id === id);
}

export class JsonAccounts implements AccountRepository {
  constructor(private readonly session: FileSession) {}

  insert(account: Account): Promise<void> {
    return this.session.write(async (contents, save): Promise<void> => {
      if (findAccount(contents, account.id)) {
        throw new DuplicateAccountError(account.id);
      }

      contents.accounts.push(account);
      await save();
    });
  }

  list(): Promise<Account[]> {
    return this.session.read((contents): Account[] => contents.accounts);
  }

  get(id: string): Promise<Account | undefined> {
    return this.session.read((contents): Account | undefined =>
      findAccount(contents, id)
    );
  }

  setTheme(id: string, themeId: ThemeId): Promise<Account | undefined> {
    return this.session.write(
      async (contents, save): Promise<Account | undefined> => {
        const account = findAccount(contents, id);

        if (!account) {
          return;
        }

        account.themeId = themeId;
        await save();

        return account;
      }
    );
  }

  update(id: string, edits: AccountEdits): Promise<Account | undefined> {
    return this.session.write(
      async (contents, save): Promise<Account | undefined> => {
        const account = findAccount(contents, id);

        if (!account) {
          return;
        }

        Object.assign(account, edits);
        await save();

        return account;
      }
    );
  }
}
