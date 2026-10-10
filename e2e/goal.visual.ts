import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { createMockGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { VIEW_GOAL_COPY } from '@/components/Goal/ViewGoal/constants';
import { WITHDRAWAL_FORM_COPY } from '@/components/Account/TransactionDrawer/WithdrawalForm/constants';
import { useDriver } from './driver/use-driver';

describe('a goal not yet reached', () => {
  const { goal, menu, account } = useDriver({
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

  it('opens its screen from the savings card', async () => {
    await goal.tapGoalLine();

    assert.equal(await goal.goalScreenBadge(), VIEW_GOAL_COPY.lockedBadge);
  });

  it('opens its screen from the menu', async () => {
    await menu.open();
    await goal.tapMenuGoal();

    assert.equal(await goal.goalScreenExists(), true);
  });

  it('returns home when its screen closes', async () => {
    await goal.tapGoalLine();
    await goal.closeGoalScreen();
    await account.waitForOverview();

    assert.equal(await goal.goalScreenExists(), false);
  });

  describe('in the withdrawal drawer', () => {
    beforeEach(async () => {
      await goal.startWithdrawal('5');
    });

    it('notes on savings how much is left to the goal', async () => {
      assert.match(await goal.savingsLockNote(), /ליעד/);
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
    await goal.startWithdrawal('5');
    await goal.pickWallet(WALLET_NAMES.savings);

    assert.equal(await goal.completesGoalNoteExists(), true);
  });
});
