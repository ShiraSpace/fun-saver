import { BaseStore } from '../base-store';
import { JsonAccounts } from './accounts';
import { FileSession } from './file-session';
import { JsonAccountUsers } from './account-users';
import { JsonTransactions } from './transactions';
import { JsonUsers } from './users';

export class JsonFileStore extends BaseStore {
  constructor(filePath: string) {
    const session = new FileSession(filePath);

    super(
      new JsonAccounts(session),
      new JsonTransactions(session),
      new JsonUsers(session),
      new JsonAccountUsers(session)
    );
  }
}
