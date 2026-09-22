import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount, mockSecondAccount } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

describe('account switching', () => {
  const { menu, header } = useDriver({
    accounts: [mockAccount, mockSecondAccount],
  });

  it('shows a row for each account', async () => {
    await menu.open();
    await menu.openAccountPicker();
    assert.equal(await menu.accountRowCount(), 2);
  });

  it('switches the active account and closes the menu when a row is tapped', async () => {
    assert.equal(await header.name(), mockAccount.name);

    await menu.open();
    await menu.openAccountPicker();
    await menu.selectAccount(1);
    await menu.waitForClosed();

    assert.equal(await header.name(), mockSecondAccount.name);
  });
});
