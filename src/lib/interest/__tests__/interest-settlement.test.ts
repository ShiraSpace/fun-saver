import { InMemoryStore } from '@/db/memory-store';
import { settleInterest, summarizeAccounts } from '../interest-settlement';
import {
  createMockAccount,
  createMockTransaction,
  createMockWallet,
  createMockWallets,
  mockSiblingAccount,
} from '@/test-utils/mocks/general.mocks';
import { TRANSACTION_TYPE } from '@/lib/constants';
import type { Account, WalletSummary } from '@/lib/types';

const [mockSavings, mockSpending] = createMockWallets();

const mockAccount = createMockAccount({
  wallets: [mockSpending, { ...mockSavings, lastInterestDate: '2026-01-03' }],
});

const mockTransactions = [
  createMockTransaction(),
  createMockTransaction({
    id: 'i',
    type: TRANSACTION_TYPE.interest,
    amount: 500,
    occurredAt: '2026-01-03',
  }),
  createMockTransaction({ id: 'd2', walletId: 'w2', amount: 5000 }),
];

describe('settleInterest', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  async function settleWallets(
    unsettledAccount: Account,
    asOf: string
  ): Promise<WalletSummary[]> {
    const [settledAccount] = await settleInterest({
      store,
      accounts: [unsettledAccount],
      asOf,
    });

    return settledAccount.account.wallets;
  }

  it('lists savings before spending, the order the dashboard lays its wallets out in', async () => {
    await store.insertTransactions(mockTransactions);

    const wallets = await settleWallets(mockAccount, '2026-01-03');

    expect(wallets.map((wallet) => wallet.name)).toEqual([
      'savings',
      'spending',
    ]);
    expect(wallets[0].balance).toBe(8500);
    expect(wallets[0].interestEarnedToday).toBe(500);
    expect(wallets[1].balance).toBe(5000);
  });

  it('shows a brand-new child’s wallets at zero', async () => {
    const wallets = await settleWallets(mockAccount, '2026-01-03');

    expect(wallets.map((wallet) => wallet.balance)).toEqual([0, 0]);
  });

  it('includes the interest just paid in, in the order it happened, so the first visit reads like every later one', async () => {
    const mockOwingAccount = createMockAccount({
      wallets: [createMockWallet()],
    });
    await store.insertTransactions([
      createMockTransaction(),
      createMockTransaction({
        id: 't2',
        occurredAt: '2026-01-03',
        createdAt: '2026-01-03T00:00:00.000Z',
      }),
    ]);

    const [settledAccount] = await settleInterest({
      store,
      accounts: [mockOwingAccount],
      asOf: '2026-01-03',
    });
    const saved = await store.listTransactionsByAccount(mockOwingAccount.id);

    expect(settledAccount.transactions).toEqual(saved);
  });

  it('writes nothing when no interest is owed, so opening a page never rewrites the saved data', async () => {
    await store.insertTransactions([createMockTransaction()]);
    const mockInsertTransactions = jest.spyOn(store, 'insertTransactions');

    await settleWallets(mockAccount, '2026-01-03');

    expect(mockInsertTransactions).not.toHaveBeenCalled();
  });

  describe('when interest has built up since it was last paid in', () => {
    const mockAccountWithUnsettledInterest = createMockAccount({
      wallets: [createMockWallet()],
    });

    let savingsWallet: WalletSummary;

    beforeEach(async () => {
      await store.insertTransactions([createMockTransaction()]);

      const wallets = await settleWallets(
        mockAccountWithUnsettledInterest,
        '2026-01-03'
      );

      savingsWallet = wallets[0];
    });

    it('pays each missed day’s interest on top of the day before', () => {
      expect(savingsWallet.interestEarned).toBe(80);
    });

    it('counts the interest just paid in as part of the balance', () => {
      expect(savingsWallet.balance).toBe(8080);
    });

    it('shows the interest earned today as today’s interest', () => {
      expect(savingsWallet.interestEarnedToday).toBe(40);
    });

    it('pays missed interest once, however often the page is opened', async () => {
      const reread = await settleWallets(
        mockAccountWithUnsettledInterest,
        '2026-01-03'
      );

      expect(reread[0].balance).toBe(8080);
      expect(
        await store.listTransactionsByWallet(
          mockAccountWithUnsettledInterest.id,
          'w1'
        )
      ).toHaveLength(3);
    });
  });
});

describe('summarizeAccounts', () => {
  const mockSiblingAccountWithoutInterest = {
    ...mockSiblingAccount,
    wallets: [createMockWallet({ id: 'w9', monthlyInterestRate: 0 })],
  };

  let store: InMemoryStore;

  beforeEach(async () => {
    store = new InMemoryStore();
    await store.insertTransactions([
      ...mockTransactions,
      createMockTransaction({
        id: 'd3',
        accountId: mockSiblingAccountWithoutInterest.id,
        walletId: 'w9',
        amount: 2500,
      }),
    ]);
  });

  it('keeps every account it was handed', async () => {
    const accountSummaries = await summarizeAccounts({
      store,
      accounts: [mockAccount, mockSiblingAccountWithoutInterest],
      asOf: '2026-01-03',
    });

    expect(accountSummaries.map((each) => each.id)).toEqual([
      mockAccount.id,
      mockSiblingAccountWithoutInterest.id,
    ]);
  });

  it('gives each account the balances of its own wallets', async () => {
    const [first, second] = await summarizeAccounts({
      store,
      accounts: [mockAccount, mockSiblingAccountWithoutInterest],
      asOf: '2026-01-03',
    });

    expect(first.wallets.map((wallet) => wallet.name)).toEqual([
      'savings',
      'spending',
    ]);
    expect(first.wallets[0].balance).toBe(8500);
    expect(second.wallets.map((wallet) => wallet.id)).toEqual(['w9']);
    expect(second.wallets[0].balance).toBe(2500);
  });

  it('has nothing to derive for nobody', async () => {
    expect(
      await summarizeAccounts({ store, accounts: [], asOf: '2026-01-03' })
    ).toEqual([]);
  });
});
