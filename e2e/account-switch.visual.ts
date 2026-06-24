import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Account } from '@/lib/types';
import { ACCOUNT, WALLETS } from '@/test-support/fixtures';
import { useDriver } from './driver/use-driver';

const SECOND_ACCOUNT: Account = {
  id: 'a2',
  name: 'מתן',
  avatarId: 'kid-08',
  isActive: true,
};

describe('account switching', () => {
  const { menu, header } = useDriver({
    accounts: [ACCOUNT, SECOND_ACCOUNT],
    wallets: WALLETS,
  });

  it('shows a chip for each account', async () => {
    await menu.open();
    assert.equal(await menu.accountChipCount(), 2);
  });

  it('switches the active account and closes the menu when a chip is tapped', async () => {
    assert.equal(await header.name(), ACCOUNT.name);

    await menu.open();
    await menu.selectAccount(1);
    await menu.waitForClosed();

    assert.equal(await header.name(), SECOND_ACCOUNT.name);
  });
});
