import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VIEW_MODE } from '@/lib/view-mode';
import { shekelsToAgorot } from '@/lib/money';
import { PIGGY_BANK_FULL_AT } from '@/lib/wallet/constants';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { COIN_PILE_SPOTS } from '@/components/ChildAccount/ChildSavings/PiggyBank/coin-pile';
import { INTEREST_COINS_COPY } from '@/components/ChildAccount/ChildSavings/InterestCoins/constants';
import { PIGGY_BANK_SHAPE } from '@/components/ChildAccount/ChildSavings/PiggyBank/constants';
import { useDriver } from './driver/use-driver';
import { PHONE_IN_SAFARI } from './driver/viewports';

const mockSavings = shekelsToAgorot(85);
const childMode = { viewMode: VIEW_MODE.child };

describe('the child home, ₪85 saved with no goal', () => {
  const { childAccount } = useDriver(
    { accounts: [mockAccount], transactions: mockTransactions },
    childMode
  );

  beforeEach(async () => {
    await childAccount.waitForScreen();
  });

  it('draws the savings as a piggy bank', async () => {
    assert.equal(await childAccount.piggyBankExists(), true);
  });

  it('fills the pile toward ₪300', async () => {
    const pileTowardThreeHundred = Math.round(
      (COIN_PILE_SPOTS.length * mockSavings) / PIGGY_BANK_FULL_AT
    );

    assert.equal(await childAccount.coinsDrawnInPile(), pileTowardThreeHundred);
  });
});

describe('the child home, ₪85 saved toward a ₪170 goal', () => {
  const { childAccount } = useDriver(
    {
      accounts: [mockAccount],
      transactions: mockTransactions,
      goals: [createMockGoal({ amount: mockSavings * 2 })],
    },
    childMode
  );

  beforeEach(async () => {
    await childAccount.waitForScreen();
  });

  it('fills half the pile', async () => {
    assert.equal(await childAccount.coinsDrawnInPile(), Math.round(COIN_PILE_SPOTS.length / 2));
  });
});

describe('the child home with the goal reached', () => {
  const { childAccount } = useDriver(
    {
      accounts: [mockAccount],
      transactions: mockTransactions,
      goals: [createMockGoal({ amount: mockSavings })],
    },
    childMode
  );

  beforeEach(async () => {
    await childAccount.waitForScreen();
  });

  it('fills the whole pile', async () => {
    assert.equal(await childAccount.coinsDrawnInPile(), COIN_PILE_SPOTS.length);
  });

  it('keeps the coin fountain off a phone that reduces motion', async () => {
    assert.equal(await childAccount.coinFountainShown(), false);
  });

  it("keeps the piggy bank's happy eyes on a phone that reduces motion", async () => {
    assert.equal(await childAccount.happyEyeCount(), PIGGY_BANK_SHAPE.happyEyes.length);
  });
});

describe('the child home with the goal reached, on a phone that allows motion', () => {
  const { childAccount, goal, appBrowser } = useDriver(
    {
      accounts: [mockAccount],
      transactions: mockTransactions,
      goals: [createMockGoal({ amount: mockSavings })],
    },
    { ...childMode, motion: 'no-preference' }
  );

  beforeEach(async () => {
    await appBrowser.resize(PHONE_IN_SAFARI);
    await childAccount.waitForScreen();
  });

  it('celebrates over the child home', async () => {
    assert.equal(await goal.celebrationShown(), true);
  });

  it('pours coins out of the piggy bank', async () => {
    assert.equal(await childAccount.coinFountainShown(), true);
  });

  it('leaves the page without a scroll once the last coin has landed', async () => {
    await childAccount.waitForLastCoinToLand();

    assert.equal(await appBrowser.hasVerticalScroll(), false);
  });
});

describe('the child home, its goal reached only by the ₪5 of interest waiting', () => {
  const { childAccount, goal } = useDriver(
    {
      accounts: [mockAccount],
      transactions: mockTransactions,
      goals: [createMockGoal({ amount: mockSavings })],
    },
    { ...childMode, motion: 'no-preference', collectedInterest: { [mockAccount.id]: '0' } }
  );

  beforeEach(async () => {
    await childAccount.waitForInterestCoins();
  });

  it('waits for the coins before it celebrates', async () => {
    assert.equal(await goal.celebrationShown(), false);
  });

  it('celebrates once the last coin is tapped in', async () => {
    await childAccount.tapInterestCoin(0);
    await childAccount.tapInterestCoin(0);
    await childAccount.tapInterestCoin(0);

    assert.equal(await goal.celebrationShown(), true);
  });
});

describe('the child home with ₪5 of interest waiting', () => {
  const { childAccount } = useDriver(
    { accounts: [mockAccount], transactions: mockTransactions },
    { ...childMode, collectedInterest: { [mockAccount.id]: '0' } }
  );

  beforeEach(async () => {
    await childAccount.waitForInterestCoins();
  });

  it('draws it as three coins', async () => {
    assert.equal(await childAccount.interestCoinCount(), 3);
  });

  it('asks the child to tap them', async () => {
    assert.equal(await childAccount.interestCoinsCopy(), INTEREST_COINS_COPY.tapTheCoins);
  });
});
