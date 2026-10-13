import { render, screen } from '@/test-utils/render';
import { SavingsLockNote } from './SavingsLockNote';
import { SAVINGS_LOCK_NOTE_COPY, SAVINGS_LOCK_NOTE_TEST_IDS } from './constants';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';

const mockSavingsBalance = 8500;

function renderSavingsLockNote(amountShekels: number): void {
  render(
    <SavingsLockNote
      goalName={mockGoal.name}
      amountShekels={amountShekels}
      savingsBalance={mockSavingsBalance}
    />
  );
}

describe('SavingsLockNote', () => {
  describe('with an amount savings does not cover', () => {
    beforeEach(() => renderSavingsLockNote(300));

    it('promises savings is kept until the amount is there', () => {
      expect(screen.getByTestId(SAVINGS_LOCK_NOTE_TEST_IDS.note)).toHaveTextContent(
        SAVINGS_LOCK_NOTE_COPY.locked(300)
      );
    });
  });

  describe('before an amount is typed', () => {
    beforeEach(() => renderSavingsLockNote(0));

    it('leaves the amount open', () => {
      expect(screen.getByTestId(SAVINGS_LOCK_NOTE_TEST_IDS.note)).toHaveTextContent('₪…');
    });
  });

  describe('when savings already covers the amount', () => {
    beforeEach(() => renderSavingsLockNote(85));

    it('says the goal can be bought now', () => {
      expect(screen.getByTestId(SAVINGS_LOCK_NOTE_TEST_IDS.note)).toHaveTextContent(
        SAVINGS_LOCK_NOTE_COPY.reached(mockGoal.name)
      );
    });
  });

  describe('when savings is a shekel short', () => {
    beforeEach(() => renderSavingsLockNote(86));

    it('keeps the promise', () => {
      expect(screen.getByTestId(SAVINGS_LOCK_NOTE_TEST_IDS.note)).toHaveTextContent(
        SAVINGS_LOCK_NOTE_COPY.locked(86)
      );
    });
  });
});
