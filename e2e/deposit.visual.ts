import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-support/fixtures';
import { splitDeposit } from '@/lib/transactions';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { useDriver } from './driver/use-driver';

describe('deposit', () => {
  const { dashboard } = useDriver({ accounts: [mockAccount] });

  it('splits a deposit across the wallets and updates the savings deposits', async () => {
    const amount = 50;
    const expectedSavings = agorotToShekels(
      splitDeposit(amount * AGOROT_PER_SHEKEL).savings
    );

    assert.match(await dashboard.savingsDeposits(), /0/);

    await dashboard.deposit(amount);

    await dashboard.waitForSavingsDeposits(String(expectedSavings));
  });
});
