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
    await menu.openAccountPicker();
    await menu.tapChildViewToggle(0);
    await menu.waitForChildViewSaved();
    await menu.close();
    await childAccount.waitForScreen();
  });

  it('shows the child screen once the menu closes', async () => {
    assert.equal(await childAccount.screenExists(), true);
  });

  it('is still the child screen after a reload, with no cookie to remember it', async () => {
    await appBrowser.reload();

    assert.equal(await childAccount.screenExists(), true);
  });
});

describe('a parent turns child view on for a sibling from the list', () => {
  const mockCurrentAccount = createMockAccount({ id: 'a1', name: 'אביגיל' });
  const mockSiblingAccount = createMockAccount({
    id: 'a2',
    name: 'יואב',
    avatarId: 'kid-08',
  });
  const { menu, header, childAccount, appBrowser } = useDriver({
    accounts: [mockCurrentAccount, mockSiblingAccount],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.openAccountPicker();
    await menu.tapChildViewToggle(1);
    await menu.waitForChildViewSaved();
    await menu.switchAccount(1);
    await header.waitForTitle(mockSiblingAccount.name);
  });

  it('opens the sibling on the child screen', async () => {
    assert.equal(await childAccount.screenExists(), true);
  });

  it("is still the sibling's child screen after a reload", async () => {
    await appBrowser.reload();

    assert.equal(await header.title(), mockSiblingAccount.name);
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

describe('a child switches to a sibling', () => {
  const mockChild = createMockAccount({
    id: 'a1',
    name: 'אביגיל',
    viewMode: VIEW_MODE.child,
  });
  const mockChildSiblingAccount = createMockAccount({
    id: 'a2',
    name: 'יואב',
    avatarId: 'kid-08',
    viewMode: VIEW_MODE.child,
  });
  const mockParentSiblingAccount = createMockAccount({
    id: 'a3',
    name: 'מתן',
    avatarId: 'kid-07',
    viewMode: VIEW_MODE.parent,
  });
  const { menu, header, childAccount, appBrowser } = useDriver({
    accounts: [mockChild, mockChildSiblingAccount, mockParentSiblingAccount],
  });

  beforeEach(async () => {
    await menu.open();
  });

  it('starts on the child whose name sorts first', async () => {
    assert.equal(await header.title(), mockChild.name);
  });

  it('offers only the sibling who is also in child view', async () => {
    assert.deepEqual(await menu.childMenuAccountNames(), [
      mockChildSiblingAccount.name,
    ]);
  });

  describe('the child taps the sibling', () => {
    beforeEach(async () => {
      await menu.switchAccountFromChildMenu(0);
      await header.waitForTitle(mockChildSiblingAccount.name);
    });

    it("shows the sibling's child screen", async () => {
      assert.equal(await childAccount.screenExists(), true);
    });

    it("is still the sibling's child screen after a reload", async () => {
      await appBrowser.reload();

      assert.equal(await header.title(), mockChildSiblingAccount.name);
      assert.equal(await childAccount.screenExists(), true);
    });
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
