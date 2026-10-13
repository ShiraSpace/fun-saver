import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VIEW_MODE } from '@/lib/view-mode';
import { createMockAccount, mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { useDriver } from './driver/use-driver';
import { PHONE_IN_SAFARI } from './driver/viewports';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { TRANSACTIONS_ROUTE } from '@/components/Transactions/constants';

describe('a parent turns child mode on', () => {
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

  it('stays in child mode after a reload', async () => {
    await appBrowser.reload();

    assert.equal(await childAccount.screenExists(), true);
  });
});

describe('the child goes back to the parent screen', () => {
  const { menu, account } = useDriver({ accounts: [mockAccount] }, { viewMode: VIEW_MODE.child });

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
  const mockChild = createMockAccount({ id: 'a1', name: 'אביגיל' });
  const mockSibling = createMockAccount({
    id: 'a2',
    name: 'יואב',
    avatarId: 'kid-08',
  });
  const mockOtherSibling = createMockAccount({
    id: 'a3',
    name: 'מתן',
    avatarId: 'kid-07',
  });
  const { menu, header, childAccount, appBrowser } = useDriver(
    { accounts: [mockChild, mockSibling, mockOtherSibling] },
    { viewMode: VIEW_MODE.child }
  );

  beforeEach(async () => {
    await menu.open();
  });

  it('starts on the child whose name sorts first', async () => {
    assert.equal(await header.title(), mockChild.name);
  });

  it('offers every sibling', async () => {
    assert.deepEqual(await menu.childMenuAccountNames(), [mockSibling.name, mockOtherSibling.name]);
  });

  describe('the child taps a sibling', () => {
    beforeEach(async () => {
      await menu.switchAccountFromChildMenu(0);
      await header.waitForTitle(mockSibling.name);
    });

    it("shows the sibling's child screen", async () => {
      assert.equal(await childAccount.screenExists(), true);
    });

    it("is still the sibling's child screen after a reload", async () => {
      await appBrowser.reload();

      assert.equal(await header.title(), mockSibling.name);
      assert.equal(await childAccount.screenExists(), true);
    });
  });
});

for (const parentPage of [METHOD_ROUTE, TRANSACTIONS_ROUTE]) {
  describe(`a child who opens ${parentPage} by its address`, () => {
    const { menu, appBrowser } = useDriver(
      { accounts: [mockAccount] },
      { viewMode: VIEW_MODE.child }
    );

    beforeEach(async () => {
      await appBrowser.visit(parentPage);
      await menu.open();
    });

    it('still gets the child menu', async () => {
      assert.equal(await menu.childMenuExists(), true);
    });
  });
}

describe('a parent turns child mode on away from home, then presses back', () => {
  const { menu, childAccount, appBrowser } = useDriver({
    accounts: [mockAccount],
  });

  beforeEach(async () => {
    await menu.open();
    await menu.openMethodPage();
    await menu.open();
    await menu.tapViewModeSwitch();
    await menu.open();
    await menu.waitForChildMenu();
    await appBrowser.back();
    await childAccount.waitForScreen();
  });

  it('comes home to the child screen', async () => {
    assert.equal(await childAccount.screenExists(), true);
  });
});

describe('a child with a goal, on an iPhone in Safari', () => {
  const { childAccount, appBrowser } = useDriver(
    { accounts: [mockAccount], transactions: mockTransactions, goals: [createMockGoal()] },
    { viewMode: VIEW_MODE.child }
  );

  beforeEach(async () => {
    await appBrowser.resize(PHONE_IN_SAFARI);
    await childAccount.waitForScreen();
  });

  it('sees every wallet without scrolling', async () => {
    const walletsBottom = await childAccount.walletsBottom();

    assert.ok(
      walletsBottom <= PHONE_IN_SAFARI.height,
      `the wallets end at ${walletsBottom}px, below the ${PHONE_IN_SAFARI.height}px screen`
    );
  });
});
