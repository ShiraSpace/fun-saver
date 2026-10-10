import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { WITHDRAWAL_FORM_COPY } from '@/components/Account/TransactionDrawer/WithdrawalForm/constants';
import { useDriver } from './driver/use-driver';

describe('a goal set on another phone while the drawer is open', () => {
  const { goal, store } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
  });

  beforeEach(async () => {
    await goal.startWithdrawal('5');
    await goal.pickWallet(WALLET_NAMES.savings);
    await store.addGoal(mockGoal);
    await goal.submit();
    await goal.waitForLockedSavings();
  });

  it('refreshes the drawer into the kept savings', async () => {
    assert.equal(
      await goal.submitLabel(),
      WITHDRAWAL_FORM_COPY.savingsLockedSubmit
    );
  });

  it('shows no error alert', async () => {
    assert.equal(await goal.drawerErrorExists(), false);
  });
});
