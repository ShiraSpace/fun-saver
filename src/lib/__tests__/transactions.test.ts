import { InMemoryStore } from '@/db/memory-store';
import { AccountsStore } from '../accounts-store';
import { addDeposit, splitDeposit } from '../transactions';
import { DEPOSIT_SPLIT } from '../constants';
import { ValidationError } from '../errors';
import { mockCreateAccountInput } from '@/test-support/fixtures';
import type { Account, WalletName } from '../types';

const ASOF = '2026-01-01';

async function seedAccount(): Promise<{
  store: InMemoryStore;
  account: Account;
}> {
  const store = new InMemoryStore();
  const account = await new AccountsStore(store).createAccount(
    mockCreateAccountInput,
    ASOF
  );

  return { store, account };
}

describe('addDeposit', () => {
  it('records one deposit transaction per pot with its split share', async () => {
    const { store, account } = await seedAccount();
    const wallets = account.wallets;
    const walletId = (name: WalletName): string =>
      wallets.find((wallet) => wallet.name === name)!.id;

    const transactions = await addDeposit(store, account, 2000, ASOF);
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
      transactions.every((transaction) => transaction.type === 'deposit')
    ).toBe(true);
    expect(
      transactions.every((transaction) => transaction.occurredAt === ASOF)
    ).toBe(true);
  });

  it('persists the deposit transactions to the store', async () => {
    const { store, account } = await seedAccount();
    const savings = account.wallets.find(
      (wallet) => wallet.name === 'savings'
    )!;

    await addDeposit(store, account, 2000, ASOF);
    const saved = await store.listTransactionsByWallet(savings.id);

    expect(saved).toHaveLength(1);
    expect(saved[0].amount).toBe(splitDeposit(2000).savings);
  });

  it('rejects a non-positive amount', async () => {
    const { store, account } = await seedAccount();

    await expect(addDeposit(store, account, 0, ASOF)).rejects.toBeInstanceOf(
      ValidationError
    );
  });

  it('rejects a non-integer amount', async () => {
    const { store, account } = await seedAccount();

    await expect(addDeposit(store, account, 10.5, ASOF)).rejects.toBeInstanceOf(
      ValidationError
    );
  });
});

describe('splitDeposit', () => {
  it('gives each pot its configured share of the deposit', () => {
    const total = 2000;
    const split = splitDeposit(total);

    expect(split.spending).toBe(Math.floor(total * DEPOSIT_SPLIT.spending));
    expect(split.goodDeeds).toBe(Math.floor(total * DEPOSIT_SPLIT.goodDeeds));
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

describe('DEPOSIT_SPLIT config', () => {
  it('is the single source of truth for the deposit ratios', () => {
    expect(DEPOSIT_SPLIT).toEqual({
      savings: 0.4,
      spending: 0.5,
      goodDeeds: 0.1,
    });

    const total = Object.values(DEPOSIT_SPLIT).reduce((sum, r) => sum + r, 0);
    expect(total).toBeCloseTo(1);
  });
});
