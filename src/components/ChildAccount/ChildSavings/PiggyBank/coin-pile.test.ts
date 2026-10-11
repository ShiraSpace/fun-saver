import { PIGGY_BANK_FULL_AT } from '@/lib/wallet/constants';
import { createMockGoal, createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { piggyBankFillOf } from './coin-pile';

describe('piggyBankFillOf', () => {
  describe('with no goal', () => {
    it('is empty with no savings', () => {
      const empty = 0;

      expect(piggyBankFillOf({ savingsBalance: 0 })).toBe(empty);
    });

    it('is half full at half of what it is full at', () => {
      const halfFull = 0.5;

      expect(piggyBankFillOf({ savingsBalance: PIGGY_BANK_FULL_AT / 2 })).toBe(halfFull);
    });

    it('is full at what it is full at', () => {
      const full = 1;

      expect(piggyBankFillOf({ savingsBalance: PIGGY_BANK_FULL_AT })).toBe(full);
    });

    it('is never more than full', () => {
      const full = 1;

      expect(piggyBankFillOf({ savingsBalance: PIGGY_BANK_FULL_AT * 2 })).toBe(full);
    });
  });

  describe('toward a ₪100 goal', () => {
    const mockGoal = createMockGoal({ amount: 10000 });

    it('is half full at half the goal', () => {
      const halfFull = 0.5;
      const mockSavedTowardGoal = createMockSavedTowardGoal({ goal: mockGoal });

      expect(piggyBankFillOf({ savingsBalance: 5000, savedTowardGoal: mockSavedTowardGoal })).toBe(
        halfFull
      );
    });

    it('is full once the goal is reached, even below its amount', () => {
      const full = 1;
      const mockSavedTowardGoal = createMockSavedTowardGoal({ goal: mockGoal, reached: true });

      expect(piggyBankFillOf({ savingsBalance: 5000, savedTowardGoal: mockSavedTowardGoal })).toBe(
        full
      );
    });
  });

  it('is full toward a goal of nothing', () => {
    const full = 1;
    const mockSavedTowardGoal = createMockSavedTowardGoal({ goal: createMockGoal({ amount: 0 }) });

    expect(piggyBankFillOf({ savingsBalance: 0, savedTowardGoal: mockSavedTowardGoal })).toBe(full);
  });
});
