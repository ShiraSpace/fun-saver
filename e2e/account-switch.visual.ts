import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sortedByName } from '@/db/account-users';
import { mockAccount, mockSiblingAccount } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

describe('account switching', () => {
  const accounts = [mockAccount, mockSiblingAccount];
  const { menu, header } = useDriver({ accounts });

  it('shows a row for each account', async () => {
    await menu.open();
    await menu.openAccountPicker();
    assert.equal(await menu.listedAccountCount(), 2);
  });

  it('switches the active account and closes the menu when a row is tapped', async () => {
    const [firstListed, secondListed] = sortedByName(accounts);

    assert.equal(await header.title(), firstListed.name);

    await menu.open();
    await menu.openAccountPicker();
    await menu.switchAccount(1);
    await menu.waitForClosed();

    assert.equal(await header.title(), secondListed.name);
  });
});
