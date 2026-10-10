import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { createMockGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { WITHDRAWAL_FORM_COPY } from '@/components/Account/TransactionDrawer/WithdrawalForm/constants';
import { useDriver } from './driver/use-driver';

describe('a goal not yet reached', () => {
  const { goal } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
    goals: [mockGoal],
  });

  it('shows on the savings card', async () => {
    assert.match(await goal.goalLine(), new RegExp(mockGoal.name));
  });

  it('locks the savings balance', async () => {
    assert.equal(await goal.savingsLockExists(), true);
  });

  describe('in the withdrawal drawer', () => {
    beforeEach(async () => {
      await goal.startWithdrawal(5);
    });

    it('keeps its height when savings is picked', async () => {
      const before = await goal.drawerHeight();

      await goal.pickWallet(WALLET_NAMES.savings);
      await goal.waitForLockedSavings();

      assert.equal(await goal.drawerHeight(), before);
    });

    it('locks savings', async () => {
      assert.equal(await goal.lockedWalletCount(), 1);
    });

    it('shows the goal in place of the keypad once savings is picked', async () => {
      await goal.pickWallet(WALLET_NAMES.savings);
      await goal.waitForLockedSavings();

      assert.equal(
        await goal.submitLabel(),
        WITHDRAWAL_FORM_COPY.savingsLockedSubmit
      );
    });
  });
});

describe('a goal reached', () => {
  const { goal } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
    goals: [createMockGoal({ amount: 5000 })],
  });

  it('leaves the savings balance unlocked', async () => {
    assert.equal(await goal.savingsLockExists(), false);
  });

  it('warns in the drawer that withdrawing savings completes it', async () => {
    await goal.startWithdrawal(5);
    await goal.pickWallet(WALLET_NAMES.savings);

    assert.equal(await goal.completesGoalNoteExists(), true);
  });
});
