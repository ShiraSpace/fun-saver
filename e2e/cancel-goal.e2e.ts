import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StatusCodes } from 'http-status-codes';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { HOME_ROUTE } from '@/components/Home/constants';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { METHOD_COPY } from '@/components/Method/copy';
import { useDriver } from './driver/use-driver';
import { cameHomeFromTheMethodPage } from './driver/came-home-from-the-method-page';
import type { HeldRequest } from './driver/hold-request';

const mockStoreWithGoal = {
  accounts: [mockAccount],
  transactions: mockTransactions,
  goals: [mockGoal],
};

describe('a parent holds «ביטול היעד» for 2 seconds', () => {
  const { menu, goal, cancelGoal } = useDriver(mockStoreWithGoal);

  beforeEach(async () => {
    await menu.open();
    await cancelGoal.openFromMenu();
    await cancelGoal.holdToCancel();
    await cancelGoal.waitForDialogGone();
    await goal.waitForSavingsLockGone();
  });

  it('frees savings for withdrawals', async () => {
    assert.equal(await goal.savingsLockExists(), false);
  });

  it('offers to set a goal again in the menu', async () => {
    await menu.open();

    assert.equal(await cancelGoal.setGoalOfferedInMenu(), true);
  });
});

describe('a parent only taps the hold button', () => {
  const { menu, cancelGoal } = useDriver(mockStoreWithGoal);

  beforeEach(async () => {
    await menu.open();
    await cancelGoal.openFromMenu();
    await cancelGoal.pressBriefly();
  });

  it('keeps the goal', async () => {
    assert.equal(await cancelGoal.dialogExists(), true);
  });
});

describe('a parent who came home from the Method page presses Escape in the cancel dialog', () => {
  const driver = useDriver(mockStoreWithGoal);
  const { menu, goal, cancelGoal } = driver;

  beforeEach(async () => {
    await cameHomeFromTheMethodPage(driver);
    await menu.open();
    await cancelGoal.openFromMenu();
    await cancelGoal.pressEscape();
    await cancelGoal.waitForDialogGone();
  });

  it('keeps the goal', async () => {
    assert.equal(await goal.savingsLockExists(), true);
  });

  it('then goes back to the Method page on one Back, with no leftover step', async () => {
    await driver.appBrowser.back();
    await driver.header.waitForTitle(METHOD_COPY.title);

    assert.equal(driver.appBrowser.currentPath(), METHOD_ROUTE);
  });
});

describe('a parent presses Back while the cancel is on its way, and it fails', () => {
  const driver = useDriver(mockStoreWithGoal);
  const { menu, cancelGoal } = driver;
  let mockCancel: HeldRequest;

  beforeEach(async () => {
    await menu.open();
    await cancelGoal.openFromMenu();
    mockCancel = await cancelGoal.holdTheCancel();
    await cancelGoal.holdToCancel();
    await mockCancel.requested;
    await driver.appBrowser.back();
  });

  it('keeps the dialog open while the cancel is on its way', async () => {
    assert.equal(await cancelGoal.dialogExists(), true);
  });

  it('closes on one more Back once the cancel failed, and stays home', async () => {
    await mockCancel.answer(StatusCodes.INTERNAL_SERVER_ERROR);
    await cancelGoal.waitForCancelError();
    await driver.appBrowser.back();
    await cancelGoal.waitForDialogGone();

    assert.equal(driver.appBrowser.currentPath(), HOME_ROUTE);
  });
});
