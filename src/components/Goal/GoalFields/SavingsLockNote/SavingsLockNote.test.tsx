import { render, screen } from '@/test-utils/render';
import { SavingsLockNote } from './SavingsLockNote';
import { SAVINGS_LOCK_NOTE_COPY, SAVINGS_LOCK_NOTE_TEST_IDS } from './constants';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';

const mockSavingsBalance = 8500;

describe('SavingsLockNote', () => {
  it('promises savings is kept until the amount is there', () => {
    render(
      <SavingsLockNote
        goalName={mockGoal.name}
        amountShekels={300}
        savingsBalance={mockSavingsBalance}
      />
    );

    expect(screen.getByTestId(SAVINGS_LOCK_NOTE_TEST_IDS.note)).toHaveTextContent(
      SAVINGS_LOCK_NOTE_COPY.locked(300)
    );
  });

  it('leaves the amount open before one is typed', () => {
    render(
      <SavingsLockNote
        goalName={mockGoal.name}
        amountShekels={0}
        savingsBalance={mockSavingsBalance}
      />
    );

    expect(screen.getByTestId(SAVINGS_LOCK_NOTE_TEST_IDS.note)).toHaveTextContent('₪…');
  });

  it('says the goal can be bought now when savings already covers it', () => {
    render(
      <SavingsLockNote
        goalName={mockGoal.name}
        amountShekels={85}
        savingsBalance={mockSavingsBalance}
      />
    );

    expect(screen.getByTestId(SAVINGS_LOCK_NOTE_TEST_IDS.note)).toHaveTextContent(
      SAVINGS_LOCK_NOTE_COPY.reached(mockGoal.name)
    );
  });

  it('keeps the promise when savings is a shekel short', () => {
    render(
      <SavingsLockNote
        goalName={mockGoal.name}
        amountShekels={86}
        savingsBalance={mockSavingsBalance}
      />
    );

    expect(screen.getByTestId(SAVINGS_LOCK_NOTE_TEST_IDS.note)).toHaveTextContent(
      SAVINGS_LOCK_NOTE_COPY.locked(86)
    );
  });
});
