import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount, mockTransactions } from '@/test-support/fixtures';
import { useDriver } from './driver/use-driver';

describe('withdraw', () => {
  const { dashboard } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
  });

  it('withdraws from the savings wallet and lowers its deposits', async () => {
    assert.match(await dashboard.savingsDeposits(), /80/);

    await dashboard.withdraw('savings', 30);

    await dashboard.waitForSavingsDeposits('50');
  });
});
