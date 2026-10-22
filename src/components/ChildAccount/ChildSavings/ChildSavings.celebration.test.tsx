import { fireEvent, render, screen } from '@/test-utils/render';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { mockAccountId } from '@/test-utils/mocks/account.mocks';
import { createMockGoal, createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { shownCoins } from '@/test-utils/interest-coins';
import { CELEBRATION_TEST_IDS } from '@/components/Goal/Celebration/constants';
import { ChildSavings } from './ChildSavings';

describe('ChildSavings with ₪5 of interest waiting, a reached ₪102 goal shown at ₪100', () => {
  beforeEach(() => {
    render(
      <ChildSavings
        accountId={mockAccountId}
        savings={createMockWalletSummary({ balance: 10500, interestEarned: 500 })}
        savedTowardGoal={createMockSavedTowardGoal({
          goal: createMockGoal({ amount: 10200 }),
          saved: 10500,
          stillToSave: 0,
          isGoalReached: true,
        })}
      />,
      { collectedInterest: { [mockAccountId]: '0' } }
    );
  });

  it('does not play the celebration while the coins that reach the goal wait', () => {
    expect(screen.queryByTestId(CELEBRATION_TEST_IDS.celebration)).not.toBeInTheDocument();
  });

  it("plays the celebration on the last coin's tap", () => {
    fireEvent.click(shownCoins()[0]);
    fireEvent.click(shownCoins()[0]);
    fireEvent.click(shownCoins()[0]);

    expect(screen.getByTestId(CELEBRATION_TEST_IDS.celebration)).toBeInTheDocument();
  });
});
