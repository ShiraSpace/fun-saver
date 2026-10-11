import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { createMockGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { MAX_GOAL_NAME_LENGTH } from '@/lib/goal/constants';
import { GOAL_COPY } from '@/components/Goal/constants';
import { SAVINGS_LOCK_COPY } from '@/components/Goal/ViewGoal/SavingsLock/constants';
import { HOME_ROUTE } from '@/components/Home/constants';
import { useDriver } from './driver/use-driver';
import { SMALL_PHONE } from './driver/viewports';

describe('a goal not yet reached', () => {
  const { goal, menu, appBrowser } = useDriver({
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

  it('opens the goal screen from the savings card', async () => {
    await goal.tapGoalLine();
    await goal.waitForGoalScreen();

    assert.equal(await goal.goalScreenExists(), true);
  });

  it('opens the goal screen from the menu', async () => {
    await menu.open();
    await goal.tapMenuGoal();
    await goal.waitForGoalScreen();

    assert.equal(await goal.goalScreenExists(), true);
  });

  it('returns home when ✕ closes the goal screen', async () => {
    await goal.tapGoalLine();
    await goal.waitForGoalScreen();

    await goal.tapCloseGoalScreen();
    await goal.waitForGoalScreenGone();

    assert.equal(appBrowser.currentPath(), HOME_ROUTE);
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

      assert.equal(await goal.submitLabel(), GOAL_COPY.savingsLocked);
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

  it('says on the goal screen that savings are open', async () => {
    await goal.tapGoalLine();
    await goal.waitForGoalScreen();

    assert.equal(await goal.goalScreenSavingsLock(), SAVINGS_LOCK_COPY.savingsOpen);
  });

  it('warns in the drawer that withdrawing savings completes it', async () => {
    await goal.startWithdrawal(5);
    await goal.pickWallet(WALLET_NAMES.savings);

    assert.equal(await goal.completesGoalNoteExists(), true);
  });
});

describe('a goal reached with the longest name a goal can have, on a small phone', () => {
  const mockLongestGoalName = Array.from({ length: 6 }, () => 'שששש')
    .join(' ')
    .padEnd(MAX_GOAL_NAME_LENGTH, 'ש');
  const { goal, appBrowser } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
    goals: [createMockGoal({ amount: 5000, name: mockLongestGoalName })],
  });

  describe('in the withdrawal drawer', () => {
    beforeEach(async () => {
      await appBrowser.resize(SMALL_PHONE);
      await goal.startWithdrawal(5);
    });

    it('keeps its height when savings is picked', async () => {
      const before = await goal.drawerHeight();

      await goal.pickWallet(WALLET_NAMES.savings);
      await goal.waitForCompletesGoalNote();

      assert.equal(await goal.drawerHeight(), before);
    });

    it('keeps its height when the amount runs past savings', async () => {
      await goal.pickWallet(WALLET_NAMES.savings);
      await goal.waitForCompletesGoalNote();
      const before = await goal.drawerHeight();

      await goal.typeAmount('00');
      await goal.waitForOverdraft();

      assert.equal(await goal.drawerHeight(), before);
    });

    it('shows the whole submit', async () => {
      await goal.pickWallet(WALLET_NAMES.savings);
      await goal.waitForCompletesGoalNote();

      assert.equal(await goal.submitShowsWhole(), true);
    });
  });
});
