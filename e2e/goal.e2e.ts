import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { agorotToShekels } from '@/lib/money';
import { GOAL_COPY } from '@/components/Goal/constants';
import { METHOD_COPY } from '@/components/Method/copy';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { HOME_ROUTE } from '@/components/Home/constants';
import { useDriver } from './driver/use-driver';
import {
  cameHomeFromTheMethodPage,
  openedTheMethodPage,
} from './driver/came-home-from-the-method-page';

describe('a goal set on another phone while the drawer is open', () => {
  const { goal, anotherPhone } = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
  });

  beforeEach(async () => {
    await goal.startWithdrawal(5);
    await goal.pickWallet(WALLET_NAMES.savings);
    await anotherPhone.setGoal(mockAccount.id, {
      name: mockGoal.name,
      amount: agorotToShekels(mockGoal.amount),
      picture: mockGoal.picture,
    });
    await goal.submit();
    await goal.waitForLockedSavings();
  });

  it('refreshes the drawer into the kept savings', async () => {
    assert.equal(await goal.submitLabel(), GOAL_COPY.savingsLocked);
  });
});

describe('a parent opens the goal from home, then presses back', () => {
  const driver = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
    goals: [mockGoal],
  });

  beforeEach(async () => {
    await cameHomeFromTheMethodPage(driver);
    await driver.goal.tapGoalLine();
    await driver.goal.waitForGoalScreen();
    await driver.appBrowser.back();
    await driver.goal.waitForGoalScreenGone();
  });

  it('stays on the home page', () => {
    assert.equal(driver.appBrowser.currentPath(), HOME_ROUTE);
  });
});

describe('a parent opens the goal from the menu on the Method page, then taps ✕', () => {
  const driver = useDriver({
    accounts: [mockAccount],
    transactions: mockTransactions,
    goals: [mockGoal],
  });

  beforeEach(async () => {
    await openedTheMethodPage(driver);
    await driver.menu.open();
    await driver.goal.tapMenuGoal();
    await driver.goal.waitForGoalScreen();
    await driver.goal.tapCloseGoalScreen();
    await driver.goal.waitForGoalScreenGone();
    await driver.header.waitForTitle(METHOD_COPY.title);
  });

  it('returns to the Method page', () => {
    assert.equal(driver.appBrowser.currentPath(), METHOD_ROUTE);
  });
});
