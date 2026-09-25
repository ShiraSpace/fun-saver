import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { useDriver } from './driver/use-driver';

describe('create account', () => {
  const { emptyState, createAccount, avatarPicker, header, account } =
    useDriver();

  it('opens the account form from the empty state', async () => {
    await emptyState.tapCreateAccount();
    assert.equal(await createAccount.isOpen(), true);
  });

  it('creates an account and lands on the account with three zero wallets', async () => {
    await emptyState.tapCreateAccount();
    await createAccount.isOpen();

    await createAccount.fillName('נועה');
    await avatarPicker.selectFirst();
    await createAccount.submit();

    await header.waitForTitle('נועה');
    assert.equal(await header.title(), 'נועה');
    assert.equal(await account.overviewExists(), true);
    assert.equal(await account.walletCardCount(), 3);

    const balances = await account.walletBalances();
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
    await menu.openAccountPicker();
    await menu.tapAddAccount();
  });

  it('opens the create form from the menu add chip', async () => {
    assert.equal(await createAccount.isOpen(), true);
  });

  it('creates an account from the menu and switches to it', async () => {
    await createAccount.fillName('נועה');
    await avatarPicker.selectFirst();
    await createAccount.submit();

    await header.waitForTitle('נועה');
    assert.equal(await header.title(), 'נועה');
  });

  it('returns to the current account when the create form is cancelled', async () => {
    await createAccount.cancel();

    await header.waitForTitle(mockAccount.name);
    assert.equal(await header.title(), mockAccount.name);
  });
});

describe('add account from the menu on the method page', () => {
  const { menu, createAccount } = useDriver({ accounts: [mockAccount] });

  it('opens the create form there too', async () => {
    await menu.open();
    await menu.openMethodPage();

    await menu.open();
    await menu.openAccountPicker();
    await menu.tapAddAccount();

    assert.equal(await createAccount.isOpen(), true);
  });
});
