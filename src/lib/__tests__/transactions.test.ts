import { InMemoryStore } from '@/db/memory-store';
import { AccountsStore } from '../accounts-store';
import { addDeposit, addWithdrawal, splitDeposit } from '../transactions';
import { balance } from '../derivations';
import { DEPOSIT_SPLIT } from '../constants';
import { OverdraftError, ValidationError } from '../errors';
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
  it('records one deposit transaction per wallet with its split share', async () => {
    const { store, account } = await seedAccount();
    const { wallets } = account;

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

describe('addWithdrawal', () => {
  const walletIdFor = (account: Account, name: WalletName): string =>
    account.wallets.find((wallet) => wallet.name === name)!.id;

  it('records and persists a withdrawal on the chosen pot', async () => {
    const { store, account } = await seedAccount();
    const savings = walletIdFor(account, 'savings');
    await addDeposit(store, account, 2000, ASOF);

    const transaction = await addWithdrawal(store, account, savings, 500, ASOF);

    expect(transaction.type).toBe('withdrawal');
    expect(transaction.walletId).toBe(savings);
    expect(transaction.amount).toBe(500);

    const saved = await store.listTransactionsByWallet(savings);
    expect(balance(saved)).toBe(splitDeposit(2000).savings - 500);
  });

  it('allows withdrawing the exact pot balance', async () => {
    const { store, account } = await seedAccount();
    const savings = walletIdFor(account, 'savings');
    await addDeposit(store, account, 2000, ASOF);
    const potBalance = splitDeposit(2000).savings;

    await expect(
      addWithdrawal(store, account, savings, potBalance, ASOF)
    ).resolves.toMatchObject({ amount: potBalance });
  });

  it('rejects withdrawing more than the pot balance', async () => {
    const { store, account } = await seedAccount();
    const savings = walletIdFor(account, 'savings');
    await addDeposit(store, account, 2000, ASOF);
    const tooMuch = splitDeposit(2000).savings + 1;

    await expect(
      addWithdrawal(store, account, savings, tooMuch, ASOF)
    ).rejects.toBeInstanceOf(OverdraftError);
  });

  it('rejects a non-positive amount', async () => {
    const { store, account } = await seedAccount();
    const savings = walletIdFor(account, 'savings');

    await expect(
      addWithdrawal(store, account, savings, 0, ASOF)
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects a non-integer amount', async () => {
    const { store, account } = await seedAccount();
    const savings = walletIdFor(account, 'savings');
    await addDeposit(store, account, 2000, ASOF);

    await expect(
      addWithdrawal(store, account, savings, 10.5, ASOF)
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it('rejects an unknown wallet', async () => {
    const { store, account } = await seedAccount();

    await expect(
      addWithdrawal(store, account, 'nope', 100, ASOF)
    ).rejects.toBeInstanceOf(ValidationError);
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
