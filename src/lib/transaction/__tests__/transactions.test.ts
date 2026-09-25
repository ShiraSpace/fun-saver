import { InMemoryStore } from '@/db/memory-store';
import { today } from '@/lib/clock';
import { addDeposit, addWithdrawal, splitDeposit } from '../transactions';
import { balance } from '@/lib/wallet-totals';
import { DEPOSIT_SHARES, TRANSACTION_TYPE } from '../constants';
import { OverdraftError } from '../errors';
import { ValidationError } from '@/lib/errors';
import { createOwnedAccount } from '@/test-utils/owned-account';
import type { Account, WalletName } from '@/lib/types';

const mockToday = today();

async function storeWithOwnedAccount(): Promise<{
  store: InMemoryStore;
  account: Account;
}> {
  const store = new InMemoryStore();

  return { store, account: await createOwnedAccount(store) };
}

describe('addDeposit', () => {
  it('records one deposit transaction per wallet with its split share', async () => {
    const { store, account } = await storeWithOwnedAccount();
    const { wallets } = account;

    const walletId = (name: WalletName): string =>
      wallets.find((wallet) => wallet.name === name)!.id;

    const transactions = await addDeposit({
      store,
      account,
      amountAgorot: 2000,
      asOf: mockToday,
    });
    const amountFor = (name: WalletName): number =>
      transactions.find(
        (transaction) => transaction.walletId === walletId(name)
      )!.amount;
    const expected = splitDeposit(2000);

    expect(transactions).toHaveLength(3);
    expect(amountFor('savings')).toBe(expected.savings);
    expect(amountFor('spending')).toBe(expected.spending);
    expect(amountFor('goodDeeds')).toBe(expected.goodDeeds);
    expect(
      transactions.every(
        (transaction) => transaction.type === TRANSACTION_TYPE.deposit
      )
    ).toBe(true);
    expect(
      transactions.every((transaction) => transaction.occurredAt === mockToday)
    ).toBe(true);
  });

  it('persists the deposit transactions to the store', async () => {
    const { store, account } = await storeWithOwnedAccount();
    const savings = account.wallets.find(
      (wallet) => wallet.name === 'savings'
    )!;

    await addDeposit({ store, account, amountAgorot: 2000, asOf: mockToday });
    const saved = await store.listTransactionsByWallet(account.id, savings.id);

    expect(saved).toHaveLength(1);
    expect(saved[0].amount).toBe(splitDeposit(2000).savings);
  });

  it('rejects a non-positive amount', async () => {
    const { store, account } = await storeWithOwnedAccount();

    await expect(
      addDeposit({ store, account, amountAgorot: 0, asOf: mockToday })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects a non-integer amount', async () => {
    const { store, account } = await storeWithOwnedAccount();

    await expect(
      addDeposit({ store, account, amountAgorot: 10.5, asOf: mockToday })
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('addWithdrawal', () => {
  const walletIdFor = (account: Account, name: WalletName): string =>
    account.wallets.find((wallet) => wallet.name === name)!.id;

  it('records and persists a withdrawal on the chosen wallet', async () => {
    const { store, account } = await storeWithOwnedAccount();
    const savings = walletIdFor(account, 'savings');
    await addDeposit({ store, account, amountAgorot: 2000, asOf: mockToday });

    const transaction = await addWithdrawal({
      store,
      account,
      walletId: savings,
      amountAgorot: 500,
      asOf: mockToday,
    });

    expect(transaction.type).toBe(TRANSACTION_TYPE.withdrawal);
    expect(transaction.walletId).toBe(savings);
    expect(transaction.amount).toBe(500);

    const saved = await store.listTransactionsByWallet(account.id, savings);
    expect(balance(saved)).toBe(splitDeposit(2000).savings - 500);
  });

  it('allows withdrawing the exact wallet balance', async () => {
    const { store, account } = await storeWithOwnedAccount();
    const savings = walletIdFor(account, 'savings');
    await addDeposit({ store, account, amountAgorot: 2000, asOf: mockToday });
    const walletBalance = splitDeposit(2000).savings;

    await expect(
      addWithdrawal({
        store,
        account,
        walletId: savings,
        amountAgorot: walletBalance,
        asOf: mockToday,
      })
    ).resolves.toMatchObject({ amount: walletBalance });
  });

  it('rejects withdrawing more than the wallet balance', async () => {
    const { store, account } = await storeWithOwnedAccount();
    const savings = walletIdFor(account, 'savings');
    await addDeposit({ store, account, amountAgorot: 2000, asOf: mockToday });
    const tooMuch = splitDeposit(2000).savings + 1;

    await expect(
      addWithdrawal({
        store,
        account,
        walletId: savings,
        amountAgorot: tooMuch,
        asOf: mockToday,
      })
    ).rejects.toBeInstanceOf(OverdraftError);
  });

  it('rejects a non-positive amount', async () => {
    const { store, account } = await storeWithOwnedAccount();
    const savings = walletIdFor(account, 'savings');

    await expect(
      addWithdrawal({
        store,
        account,
        walletId: savings,
        amountAgorot: 0,
        asOf: mockToday,
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects a non-integer amount', async () => {
    const { store, account } = await storeWithOwnedAccount();
    const savings = walletIdFor(account, 'savings');
    await addDeposit({ store, account, amountAgorot: 2000, asOf: mockToday });

    await expect(
      addWithdrawal({
        store,
        account,
        walletId: savings,
        amountAgorot: 10.5,
        asOf: mockToday,
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects an unknown wallet', async () => {
    const { store, account } = await storeWithOwnedAccount();

    await expect(
      addWithdrawal({
        store,
        account,
        walletId: 'nope',
        amountAgorot: 100,
        asOf: mockToday,
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe('splitDeposit', () => {
  it('gives each wallet its configured share of the deposit', () => {
    const total = 2000;
    const split = splitDeposit(total);

    expect(split.spending).toBe(Math.floor(total * DEPOSIT_SHARES.spending));
    expect(split.goodDeeds).toBe(Math.floor(total * DEPOSIT_SHARES.goodDeeds));
    expect(split.savings).toBe(total - split.spending - split.goodDeeds);
  });

  it('gives the rounding remainder to savings so the parts sum to the total', () => {
    const total = 333;
    const split = splitDeposit(total);

    expect(split.savings + split.spending + split.goodDeeds).toBe(total);
    expect(split.savings).toBe(total - split.spending - split.goodDeeds);
  });

  it('keeps the sum exact for a large, awkward amount', () => {
    const total = 123457;
    const split = splitDeposit(total);

    expect(split.savings + split.spending + split.goodDeeds).toBe(total);
  });
});

describe('DEPOSIT_SHARES config', () => {
  it('is the single source of truth for the deposit ratios', () => {
    expect(DEPOSIT_SHARES).toEqual({
      savings: 0.4,
      spending: 0.5,
      goodDeeds: 0.1,
    });

    const total = Object.values(DEPOSIT_SHARES).reduce((sum, r) => sum + r, 0);
    expect(total).toBeCloseTo(1);
  });
});
