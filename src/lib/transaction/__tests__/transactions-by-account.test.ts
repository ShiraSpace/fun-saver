import {
  mockAccountSummary,
  mockSiblingAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import {
  accountTransactions,
  transactionsByAccount,
} from '../transactions-by-account';

describe('transactions by account', () => {
  const byAccount = transactionsByAccount([
    { account: mockAccountSummary, transactions: mockTransactions },
    { account: mockSiblingAccountSummary, transactions: [] },
  ]);

  describe('each transaction sent to the page', () => {
    const [firstTransaction] = Object.values(byAccount).flat();

    it('leaves its id behind', () => {
      expect(firstTransaction).not.toHaveProperty('id');
    });

    it('leaves the account behind', () => {
      expect(firstTransaction).not.toHaveProperty('accountId');
    });

    it('keeps what the chart and the list need to draw it', () => {
      const [mockFirstTransaction] = mockTransactions;

      expect(firstTransaction).toMatchObject({
        walletId: mockFirstTransaction.walletId,
        type: mockFirstTransaction.type,
        amount: mockFirstTransaction.amount,
        occurredAt: mockFirstTransaction.occurredAt,
        createdAt: mockFirstTransaction.createdAt,
      });
    });
  });

  it('keys each account’s transactions by that account', () => {
    expect(byAccount[mockSiblingAccountSummary.id]).toEqual([]);
  });

  describe('an account the page was sent nothing for', () => {
    const mockUnknownAccountId = 'no-such-account';

    it('hands back the same empty list every time, so the screen does not redo its sums', () => {
      expect(accountTransactions(byAccount, mockUnknownAccountId)).toBe(
        accountTransactions(byAccount, mockUnknownAccountId)
      );
    });
  });

  it('hands back an account’s own transactions', () => {
    expect(accountTransactions(byAccount, mockAccountSummary.id)).toBe(
      byAccount[mockAccountSummary.id]
    );
  });
});
