import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useDriver } from './driver/use-driver';

describe('create account', () => {
  const { emptyState, createAccount } = useDriver();

  it('opens the account form from the empty state', async () => {
    await emptyState.clickCreateAccount();
    assert.equal(await createAccount.isOpen(), true);
  });
});
