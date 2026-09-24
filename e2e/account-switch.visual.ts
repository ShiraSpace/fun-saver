import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { byAccountName } from '@/db/account-users';
import { mockAccount, mockSecondAccount } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

describe('account switching', () => {
  const accounts = [mockAccount, mockSecondAccount];
  const { menu, header } = useDriver({ accounts });

  it('shows a row for each account', async () => {
    await menu.open();
    await menu.openAccountPicker();
    assert.equal(await menu.accountRowCount(), 2);
  });

  it('switches the active account and closes the menu when a row is tapped', async () => {
    const [firstListed, secondListed] = byAccountName(accounts);

    assert.equal(await header.name(), firstListed.name);

    await menu.open();
    await menu.openAccountPicker();
    await menu.switchAccount(1);
    await menu.waitForClosed();

    assert.equal(await header.name(), secondListed.name);
  });
});
