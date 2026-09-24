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

  it('keeps ids and the account off the page', () => {
    const [firstTransaction] = Object.values(byAccount).flat();

    expect(Object.keys(firstTransaction).sort()).toEqual([
      'amount',
      'createdAt',
      'occurredAt',
      'type',
      'walletId',
    ]);
  });

  it('keys each account’s transactions by that account', () => {
    expect(byAccount[mockSiblingAccountSummary.id]).toEqual([]);
  });
});
