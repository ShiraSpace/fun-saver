import { RepositoryStore } from '../repository-store';
import { MemoryAccounts } from './accounts';
import { MemoryAccountUsers } from './account-users';
import { MemoryGoals } from './goals';
import { MemoryTransactions } from './transactions';
import { MemoryUsers } from './users';

export class InMemoryStore extends RepositoryStore {
  constructor() {
    const accounts = new MemoryAccounts();
    const transactions = new MemoryTransactions();
    const users = new MemoryUsers();

    super(
      accounts,
      transactions,
      users,
      new MemoryAccountUsers(accounts, users),
      new MemoryGoals(transactions)
    );
  }
}
