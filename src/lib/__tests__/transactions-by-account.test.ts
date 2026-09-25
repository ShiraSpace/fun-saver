import {
  mockAccountSummary,
  mockSiblingAccountSummary,
  mockTransactions,
} from '@/test-utils/mocks/general.mocks';
import { transactionsByAccount } from '../transactions-by-account';

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
});
