import { MAX_GOAL_SHEKELS } from '@/lib/goal/constants';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { goalEntryErrors, hasGoalEntryErrors, NO_GOAL_ENTRY_ERRORS } from './goal-entry';

describe('goalEntryErrors', () => {
  it('finds the name missing when it is only spaces', () => {
    expect(goalEntryErrors({ goalName: '  ', amountShekels: 300 }).nameMissing).toBe(true);
  });

  it('finds the amount missing at zero', () => {
    expect(goalEntryErrors({ goalName: mockGoal.name, amountShekels: 0 }).amountMissing).toBe(true);
  });

  it('finds the amount too high above the most a goal can be', () => {
    const errors = goalEntryErrors({
      goalName: mockGoal.name,
      amountShekels: MAX_GOAL_SHEKELS + 1,
    });

    expect(errors.amountTooHigh).toBe(true);
  });

  it('accepts the most a goal can be', () => {
    const errors = goalEntryErrors({ goalName: mockGoal.name, amountShekels: MAX_GOAL_SHEKELS });

    expect(errors.amountTooHigh).toBe(false);
  });
});

describe('hasGoalEntryErrors', () => {
  it('is false when nothing is wrong', () => {
    expect(hasGoalEntryErrors(NO_GOAL_ENTRY_ERRORS)).toBe(false);
  });

  it('is true when one thing is wrong', () => {
    expect(hasGoalEntryErrors({ ...NO_GOAL_ENTRY_ERRORS, amountTooHigh: true })).toBe(true);
  });
});
