import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VIEW_MODE } from '@/lib/view-mode';
import { createMockAccount, mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { useDriver } from './driver/use-driver';
import { PHONE_IN_SAFARI } from './driver/viewports';

const noCoinsCollected = { [mockAccount.id]: '0' };
const childModeWithCoinsWaiting = {
  viewMode: VIEW_MODE.child,
  collectedInterest: noCoinsCollected,
};

describe('a child with ₪5 of interest waiting since the last visit', () => {
  const { childAccount, appBrowser } = useDriver(
    { accounts: [mockAccount], transactions: mockTransactions },
    childModeWithCoinsWaiting
  );

  beforeEach(async () => {
    await childAccount.waitForInterestCoins();
  });

  it('sees it as three coins', async () => {
    assert.equal(await childAccount.interestCoinCount(), 3);
  });

  it('sees the savings without it', async () => {
    assert.equal(await childAccount.savingsBalance(), '₪80');
  });

  describe('taps a ₪2 coin', () => {
    beforeEach(async () => {
      await childAccount.tapInterestCoin(0);
    });

    it('sees the savings rise by ₪2', async () => {
      assert.equal(await childAccount.savingsBalance(), '₪82');
    });

    it('still sees the coin in the savings after a reload', async () => {
      await appBrowser.reload();
      await childAccount.waitForInterestCoins();

      assert.equal(await childAccount.savingsBalance(), '₪82');
    });
  });
});

describe('a child who taps a coin, then switches to a sibling and back', () => {
  const mockSibling = createMockAccount({ id: 'a2', name: 'שירה', avatarId: 'kid-08' });
  const { childAccount, menu, header } = useDriver(
    { accounts: [mockAccount, mockSibling], transactions: mockTransactions },
    childModeWithCoinsWaiting
  );

  beforeEach(async () => {
    await childAccount.waitForInterestCoins();
    await childAccount.tapInterestCoin(0);
    await menu.open();
    await menu.switchAccountFromChildMenu(0);
    await header.waitForTitle(mockSibling.name);
    await menu.open();
    await menu.switchAccountFromChildMenu(0);
    await header.waitForTitle(mockAccount.name);
    await childAccount.waitForInterestCoins();
  });

  it('still sees the coin in the savings', async () => {
    assert.equal(await childAccount.savingsBalance(), '₪82');
  });
});

describe('a child who taps a coin, then the phone goes to parent mode and back', () => {
  const { childAccount, menu, account } = useDriver(
    { accounts: [mockAccount], transactions: mockTransactions },
    childModeWithCoinsWaiting
  );

  beforeEach(async () => {
    await childAccount.waitForInterestCoins();
    await childAccount.tapInterestCoin(0);
    await menu.open();
    await menu.tapViewModeSwitch();
    await account.waitForOverview();
    await menu.open();
    await menu.tapViewModeSwitch();
    await childAccount.waitForInterestCoins();
  });

  it('still sees the coin in the savings', async () => {
    assert.equal(await childAccount.savingsBalance(), '₪82');
  });
});

describe('a child on the first visit on this phone', () => {
  const { childAccount, appBrowser } = useDriver(
    { accounts: [mockAccount], transactions: mockTransactions },
    { viewMode: VIEW_MODE.child }
  );

  beforeEach(async () => {
    await childAccount.waitForScreen();
  });

  it('sees no coins, the count starting now', async () => {
    assert.equal(await childAccount.interestCoinCount(), 0);
  });

  it('still sees none after a reload', async () => {
    await appBrowser.reload();
    await childAccount.waitForScreen();

    assert.equal(await childAccount.interestCoinCount(), 0);
  });
});

describe('a child with a goal and coins waiting, on an iPhone in Safari', () => {
  const { childAccount, appBrowser } = useDriver(
    { accounts: [mockAccount], transactions: mockTransactions, goals: [createMockGoal()] },
    childModeWithCoinsWaiting
  );

  beforeEach(async () => {
    await appBrowser.resize(PHONE_IN_SAFARI);
    await childAccount.waitForGoal();
    await childAccount.waitForInterestCoins();
  });

  it('sees every wallet without scrolling', async () => {
    const walletsBottom = await childAccount.walletsBottom();

    assert.ok(
      walletsBottom <= PHONE_IN_SAFARI.height,
      `the wallets end at ${walletsBottom}px, below the ${PHONE_IN_SAFARI.height}px screen`
    );
  });
});
