import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount, mockTransactions } from '@/test-utils/fixtures';
import { useDriver } from './driver/use-driver';

describe('withdraw', () => {
  const { dashboard } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
  });

  it('withdraws from the savings wallet and lowers its principal', async () => {
    assert.match(await dashboard.savingsPrincipal(), /80/);

    await dashboard.withdraw('savings', 30);

    await dashboard.waitForSavingsPrincipal('50');
  });
});
