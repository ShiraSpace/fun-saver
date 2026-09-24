import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/fixtures';
import { splitDeposit } from '@/lib/transactions';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { useDriver } from './driver/use-driver';

describe('deposit', () => {
  const { dashboard } = useDriver({ accounts: [mockAccount] });

  it('splits a deposit across the wallets and updates the savings principal', async () => {
    const amount = 50;
    const expectedSavings = agorotToShekels(
      splitDeposit(amount * AGOROT_PER_SHEKEL).savings
    );

    assert.match(await dashboard.savingsPrincipal(), /0/);

    await dashboard.deposit(amount);

    await dashboard.waitForSavingsPrincipal(String(expectedSavings));
  });
});
