import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount, mockSecondAccount } from '@/test-support/fixtures';
import { useDriver } from './driver/use-driver';

describe('account switching', () => {
  const { menu, header } = useDriver({
    accounts: [mockAccount, mockSecondAccount],
  });

  it('shows a chip for each account', async () => {
    await menu.open();
    assert.equal(await menu.accountChipCount(), 2);
  });

  it('switches the active account and closes the menu when a chip is tapped', async () => {
    assert.equal(await header.name(), mockAccount.name);

    await menu.open();
    await menu.selectAccount(1);
    await menu.waitForClosed();

    assert.equal(await header.name(), mockSecondAccount.name);
  });
});
