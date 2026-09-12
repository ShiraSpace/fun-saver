import type { Account, AccountEdits } from '@/lib/types';
import type { ThemeId } from '@/theme/registry';
import type { AccountRepository, StoreData } from '../data-store';
import type { FileSession } from './file-session';

function findAccount(data: StoreData, id: string): Account | undefined {
  return data.accounts.find((account) => account.id === id);
}

export class JsonAccounts implements AccountRepository {
  constructor(private readonly session: FileSession) {}

  insert(account: Account): Promise<void> {
    return this.session.write(async (data, save): Promise<void> => {
      data.accounts.push(account);
      await save();
    });
  }

  list(): Promise<Account[]> {
    return this.session.read((data): Account[] => data.accounts);
  }

  get(id: string): Promise<Account | undefined> {
    return this.session.read((data): Account | undefined =>
      findAccount(data, id)
    );
  }

  setTheme(id: string, themeId: ThemeId): Promise<Account | undefined> {
    return this.session.write(
      async (data, save): Promise<Account | undefined> => {
        const account = findAccount(data, id);

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
      async (data, save): Promise<Account | undefined> => {
        const account = findAccount(data, id);

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
