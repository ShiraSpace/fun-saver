import { describe, it } from 'node:test';
import { useDriver } from './driver/use-driver';

const ACCOUNT_NAME_INPUT = 'account-name-input';

describe('create account', () => {
  const { emptyState, session } = useDriver();

  it('opens the account form from the empty state', async () => {
    await emptyState.clickCreateAccount();
    await session.box(ACCOUNT_NAME_INPUT);
  });
});
