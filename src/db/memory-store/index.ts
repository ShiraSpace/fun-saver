import { BaseStore } from '../base-store';
import { MemoryAccounts } from './accounts';
import { MemoryAccountUsers } from './account-users';
import { MemoryTransactions } from './transactions';
import { MemoryUsers } from './users';

export class InMemoryStore extends BaseStore {
  constructor() {
    const accounts = new MemoryAccounts();
    const users = new MemoryUsers();

    super(
      accounts,
      new MemoryTransactions(),
      users,
      new MemoryAccountUsers(accounts, users)
    );
  }
}
