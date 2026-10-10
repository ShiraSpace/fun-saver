import type { AccountSummary } from '@/lib/account/types';
import { createMockAccount } from '@/test-utils/mocks/account.mocks';
import {
  createMockGoal,
  createMockSavedTowardGoal,
} from '@/test-utils/mocks/goal.mocks';
import {
  createMockWalletSummary,
  mockWalletSummaries,
} from '@/test-utils/mocks/wallet.mocks';
import {
  savedTowardGoalIn,
  savedTowardGoalOf,
  savingsLocked,
} from '../saved-toward-goal';

const mockGoalAmount = 30000;

function createMockAccountSaving(savingsBalance: number): AccountSummary {
  return {
    ...createMockAccount(),
    wallets: [createMockWalletSummary({ balance: savingsBalance })],
    goal: createMockGoal({ amount: mockGoalAmount }),
  };
}

describe('savedTowardGoalOf', () => {
  it('has nothing saved toward a goal when the account has none', () => {
    const mockAccountWithoutGoal = {
      ...createMockAccountSaving(8500),
      goal: undefined,
    };

    expect(savedTowardGoalOf(mockAccountWithoutGoal)).toBeUndefined();
  });

  it('floors what is saved to whole shekels', () => {
    expect(savedTowardGoalOf(createMockAccountSaving(29950))?.saved).toBe(
      29900
    );
  });

  it('counts what is still to save from the floored amount', () => {
    expect(savedTowardGoalOf(createMockAccountSaving(29950))?.stillToSave).toBe(
      100
    );
  });

  it('is reached once savings hold the goal amount', () => {
    expect(
      savedTowardGoalOf(createMockAccountSaving(mockGoalAmount))?.reached
    ).toBe(true);
  });

  it('is not reached while savings are short of the goal', () => {
    expect(savedTowardGoalOf(createMockAccountSaving(29950))?.reached).toBe(
      false
    );
  });

  it('never has a negative amount still to save', () => {
    expect(savedTowardGoalOf(createMockAccountSaving(40000))?.stillToSave).toBe(
      0
    );
  });
});

describe('savingsLocked', () => {
  it('keeps savings while the goal is not reached', () => {
    expect(savingsLocked(createMockSavedTowardGoal({ reached: false }))).toBe(
      true
    );
  });

  it('lets savings go once the goal is reached', () => {
    expect(savingsLocked(createMockSavedTowardGoal({ reached: true }))).toBe(
      false
    );
  });

  it('keeps nothing without a goal', () => {
    expect(savingsLocked(undefined)).toBe(false);
  });
});

describe('savedTowardGoalIn', () => {
  const mockSavedTowardGoal = createMockSavedTowardGoal();
  const [mockSavings, mockSpending] = mockWalletSummaries;

  it('is what is saved toward the goal, in savings', () => {
    expect(savedTowardGoalIn(mockSavings, mockSavedTowardGoal)).toBe(
      mockSavedTowardGoal
    );
  });

  it('is nothing in any other wallet', () => {
    expect(
      savedTowardGoalIn(mockSpending, mockSavedTowardGoal)
    ).toBeUndefined();
  });

  it('is nothing when no wallet is picked', () => {
    expect(savedTowardGoalIn(undefined, mockSavedTowardGoal)).toBeUndefined();
  });
});
