import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VIEW_MODE } from '@/lib/view-mode';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockTransactions } from '@/test-utils/mocks/transaction.mocks';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { COIN_PILE_SPOTS } from '@/components/ChildAccount/ChildSavings/PiggyBank/coin-pile';
import { useDriver } from './driver/use-driver';

const savedShekels = 85;
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
    const pileTowardThreeHundred = Math.round((COIN_PILE_SPOTS.length * savedShekels) / 300);

    assert.equal(await childAccount.coinsInPile(), pileTowardThreeHundred);
  });
});

describe('the child home, ₪85 saved toward a ₪170 goal', () => {
  const { childAccount } = useDriver(
    {
      accounts: [mockAccount],
      transactions: mockTransactions,
      goals: [createMockGoal({ amount: 17000 })],
    },
    childMode
  );

  beforeEach(async () => {
    await childAccount.waitForScreen();
  });

  it('fills half the pile', async () => {
    assert.equal(await childAccount.coinsInPile(), Math.round(COIN_PILE_SPOTS.length / 2));
  });
});

describe('the child home with the goal reached', () => {
  const { childAccount } = useDriver(
    {
      accounts: [mockAccount],
      transactions: mockTransactions,
      goals: [createMockGoal({ amount: 5000 })],
    },
    childMode
  );

  beforeEach(async () => {
    await childAccount.waitForScreen();
  });

  it('fills the whole pile', async () => {
    assert.equal(await childAccount.coinsInPile(), COIN_PILE_SPOTS.length);
  });
});
