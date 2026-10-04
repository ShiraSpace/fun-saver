import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VIEW_MODE } from '@/lib/account/view-mode';
import {
  createMockAccount,
  mockAccount,
} from '@/test-utils/mocks/account.mocks';
import { useDriver } from './driver/use-driver';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { TRANSACTIONS_ROUTE } from '@/components/Transactions/constants';

describe('an account stored in child view', () => {
  const { childAccount } = useDriver({
    accounts: [createMockAccount({ viewMode: VIEW_MODE.child })],
  });

  it('opens straight on the child screen', async () => {
    assert.equal(await childAccount.screenExists(), true);
  });
});

describe('a parent turns child view on', () => {
  const { menu, childAccount, appBrowser } = useDriver({
    accounts: [mockAccount],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.tapViewModeSwitch();
    await childAccount.waitForScreen();
  });

  it('shows the child screen', async () => {
    assert.equal(await childAccount.screenExists(), true);
  });

  it('is still the child screen after a reload, with no cookie to remember it', async () => {
    await appBrowser.reload();

    assert.equal(await childAccount.screenExists(), true);
  });
});

describe('the child goes back to the parent screen', () => {
  const { menu, account } = useDriver({
    accounts: [createMockAccount({ viewMode: VIEW_MODE.child })],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.tapViewModeSwitch();
    await account.waitForOverview();
  });

  it('shows the parent screen again', async () => {
    assert.equal(await account.overviewExists(), true);
  });
});

for (const parentPage of [METHOD_ROUTE, TRANSACTIONS_ROUTE]) {
  describe(`a child who opens ${parentPage} by its address`, () => {
    const { menu, appBrowser } = useDriver({
      accounts: [createMockAccount({ viewMode: VIEW_MODE.child })],
    });

    beforeEach(async () => {
      await appBrowser.visit(parentPage);
      await menu.open();
    });

    it('still gets the child menu', async () => {
      assert.equal(await menu.childMenuExists(), true);
    });
  });
}
