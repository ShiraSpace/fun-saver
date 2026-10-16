import { createMockGoal, createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import {
  resolveCollectedInterest,
  savedTowardGoalLessUncollectedInterest,
  savingsLessUncollectedInterest,
  uncollectedInterestOf,
} from '../collected-interest';

describe('savingsLessUncollectedInterest with ₪3 waiting, on ₪50.90 holding ₪13.20 of interest', () => {
  const savingsShown = savingsLessUncollectedInterest({
    savings: { balance: 5090, interestEarned: 1320 },
    uncollectedInterest: 300,
  });

  it('takes it off the whole shekels of the balance', () => {
    expect(savingsShown.balance).toBe(4700);
  });

  it('takes it off the whole shekels the money earned by itself', () => {
    expect(savingsShown.interestEarned).toBe(1000);
  });

  it("leaves the child's own money as it is", () => {
    expect(savingsShown.principal).toBe(3700);
  });
});

it('never shows less than ₪0 after the interest was spent', () => {
  const mockSavings = { balance: 199, interestEarned: 450 };
  const mockCollectedInterest = resolveCollectedInterest({
    storedCollectedInterest: '251',
    savings: mockSavings,
  });

  expect(
    savingsLessUncollectedInterest({
      savings: mockSavings,
      uncollectedInterest: uncollectedInterestOf({
        savings: mockSavings,
        collectedInterest: mockCollectedInterest,
      }),
    }).balance
  ).toBe(0);
});

describe('savedTowardGoalLessUncollectedInterest with ₪5 waiting, ₪105 saved toward ₪300', () => {
  const savedTowardGoalShown = savedTowardGoalLessUncollectedInterest({
    savedTowardGoal: createMockSavedTowardGoal({ saved: 10500, stillToSave: 19500 }),
    uncollectedInterest: 500,
  });

  it('takes it off what is saved', () => {
    expect(savedTowardGoalShown?.saved).toBe(10000);
  });

  it('adds it to what is still to save', () => {
    expect(savedTowardGoalShown?.stillToSave).toBe(20000);
  });
});

describe('savedTowardGoalLessUncollectedInterest with ₪5 waiting, ₪105 saved toward a reached ₪102', () => {
  const savedTowardGoalShown = savedTowardGoalLessUncollectedInterest({
    savedTowardGoal: createMockSavedTowardGoal({
      goal: createMockGoal({ amount: 10200 }),
      saved: 10500,
      stillToSave: 0,
      isGoalReached: true,
    }),
    uncollectedInterest: 500,
  });

  it('keeps the goal reached, as the real savings reached it', () => {
    expect(savedTowardGoalShown?.isGoalReached).toBe(true);
  });

  it('leaves nothing still to save', () => {
    expect(savedTowardGoalShown?.stillToSave).toBe(0);
  });
});

it('savedTowardGoalLessUncollectedInterest leaves no goal when there is none', () => {
  expect(savedTowardGoalLessUncollectedInterest({ uncollectedInterest: 500 })).toBeUndefined();
});
