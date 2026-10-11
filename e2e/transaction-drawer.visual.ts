import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { useDriver } from './driver/use-driver';
import { PHONE } from './driver/viewports';

describe('the transaction drawer', () => {
  const { account, goal, appBrowser } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
  });

  it('is as tall for a withdrawal as for a deposit', async () => {
    await appBrowser.resize(PHONE);
    await account.openTransactionDrawer();
    const depositHeight = await goal.drawerHeight();

    await account.switchToWithdrawal();

    assert.equal(await goal.drawerHeight(), depositHeight);
  });
});
