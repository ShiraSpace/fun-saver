import { BaseStore } from '../base-store';
import { MemoryAccounts } from './accounts';
import { MemoryTransactions } from './transactions';
import { MemoryUsers } from './users';

export class InMemoryStore extends BaseStore {
  constructor() {
    super(new MemoryAccounts(), new MemoryTransactions(), new MemoryUsers());
  }
}
