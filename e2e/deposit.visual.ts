import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/mocks/general.mocks';
import { splitDeposit } from '@/lib/transactions';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { useDriver } from './driver/use-driver';

describe('deposit', () => {
  const { account } = useDriver({ accounts: [mockAccount] });

  it('splits a deposit across the wallets and updates the savings principal', async () => {
    const amount = 50;
    const expectedSavings = agorotToShekels(
      splitDeposit(amount * AGOROT_PER_SHEKEL).savings
    );

    assert.match(await account.savingsPrincipal(), /0/);

    await account.deposit(amount);

    await account.waitForSavingsPrincipal(String(expectedSavings));
  });
});
