import { PIGGY_BANK_FULL_AT } from '@/lib/wallet/constants';
import { createMockGoal, createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { COIN_PILE_SPOTS, coinTransformOf, piggyBankFillOf } from './coin-pile';

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
      const mockSavedTowardGoal = createMockSavedTowardGoal({
        goal: mockGoal,
        isGoalReached: true,
      });

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

describe('coinTransformOf', () => {
  it('moves the coin to its spot, then tilts it', () => {
    const mockSpot = { x: 1, y: 2, tilt: 3 };

    expect(coinTransformOf(mockSpot)).toBe('translate(1 2) rotate(3)');
  });
});

describe('COIN_PILE_SPOTS', () => {
  it('sits every spot on whole hundredths, so the server and the browser draw the same pile', () => {
    const hundredths = 100;
    const spotValues = COIN_PILE_SPOTS.flatMap((spot) => [spot.x, spot.y, spot.tilt]);

    expect(
      spotValues.filter((value) => Math.round(value * hundredths) / hundredths !== value)
    ).toEqual([]);
  });
});
