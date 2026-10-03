import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { APP_VIEW_MODE } from '@/lib/account/view-mode';
import {
  createMockAccount,
  mockAccount,
} from '@/test-utils/mocks/account.mocks';
import { useDriver } from './driver/use-driver';

describe('an account stored in child view', () => {
  const { childAccount } = useDriver({
    accounts: [createMockAccount({ viewMode: APP_VIEW_MODE.child })],
  });

  it('opens straight on the child screen', async () => {
    assert.equal(await childAccount.isShown(), true);
  });
});

describe('a parent turns child view on', () => {
  const { menu, childAccount, appBrowser } = useDriver({
    accounts: [mockAccount],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.tapViewModeSwitch();
    await childAccount.waitUntilShown();
  });

  it('shows the child screen', async () => {
    assert.equal(await childAccount.isShown(), true);
  });

  it('is still the child screen after a reload, with no cookie to remember it', async () => {
    await appBrowser.reload();

    assert.equal(await childAccount.isShown(), true);
  });
});

describe('the child goes back to the parent screen', () => {
  const { menu, childAccount, account } = useDriver({
    accounts: [createMockAccount({ viewMode: APP_VIEW_MODE.child })],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.tapViewModeSwitch();
    await account.waitForOverview();
  });

  it('shows the parent screen again', async () => {
    assert.equal(await childAccount.isShown(), false);
  });
});

describe('a child who opens a parent page by its address', () => {
  const { menu, appBrowser } = useDriver({
    accounts: [createMockAccount({ viewMode: APP_VIEW_MODE.child })],
  });

  beforeEach(async () => {
    await appBrowser.visit('/method');
    await menu.open();
  });

  it('still gets the child menu', async () => {
    assert.equal(await menu.childMenuIsShown(), true);
  });
});
