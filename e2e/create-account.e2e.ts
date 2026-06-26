import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-support/fixtures';
import { useDriver } from './driver/use-driver';

describe('create account', () => {
  const { emptyState, createAccount, avatarPicker, header, dashboard } =
    useDriver();

  it('opens the account form from the empty state', async () => {
    await emptyState.clickCreateAccount();
    assert.equal(await createAccount.isOpen(), true);
  });

  it('creates an account and lands on the dashboard with three zero wallets', async () => {
    await emptyState.clickCreateAccount();
    await createAccount.isOpen();

    await createAccount.fillName('נועה');
    await avatarPicker.selectFirst();
    await createAccount.submit();

    assert.equal(await header.name(), 'נועה');
    assert.equal(await dashboard.heroExists(), true);
    assert.equal(await dashboard.walletCardCount(), 2);

    const balances = await dashboard.walletBalances();
    assert.equal(balances.length, 3);
    for (const balance of balances) {
      assert.match(
        balance,
        /(^|\D)0(\D|$)/,
        `wallet balance reads 0: "${balance}"`
      );
    }
  });
});

describe('add account from the menu', () => {
  const { menu, createAccount, avatarPicker, header } = useDriver({
    accounts: [mockAccount],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.clickAddChip();
  });

  it('opens the create form from the menu add chip', async () => {
    assert.equal(await createAccount.isOpen(), true);
  });

  it('creates an account from the menu and switches to it', async () => {
    await createAccount.fillName('נועה');
    await avatarPicker.selectFirst();
    await createAccount.submit();

    await header.waitForName('נועה');
    assert.equal(await header.name(), 'נועה');
  });

  it('returns to the current account when the create form is cancelled', async () => {
    await createAccount.cancel();

    await header.waitForName(mockAccount.name);
    assert.equal(await header.name(), mockAccount.name);
  });
});
