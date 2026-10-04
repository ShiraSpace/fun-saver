import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { useDriver } from './driver/use-driver';

describe('withdraw', () => {
  const { account } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
  });

  it('withdraws from the savings wallet and lowers its principal', async () => {
    assert.match(await account.savingsPrincipal(), /80/);

    await account.withdraw(WALLET_NAMES.savings, 30);

    await account.waitForSavingsPrincipal('50');
  });
});
