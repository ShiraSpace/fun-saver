import { render, screen } from '@/test-utils/render';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { mockAccountSavingForGoal } from '@/test-utils/mocks/goal.mocks';
import { VIEW_GOAL_TEST_IDS } from '@/components/Goal/ViewGoal/constants';
import { APP_MODE } from '../app-mode-context';
import { GoalOverlays } from './GoalOverlays';

describe('GoalOverlays', () => {
  it('draws the goal screen while viewing a goal', () => {
    render(
      <GoalOverlays
        mode={APP_MODE.viewingGoal}
        currentAccount={mockAccountSavingForGoal}
        onClose={jest.fn()}
      />
    );

    expect(
      screen.getByTestId(VIEW_GOAL_TEST_IDS.container)
    ).toBeInTheDocument();
  });

  it('draws nothing when the account has no goal', () => {
    render(
      <GoalOverlays
        mode={APP_MODE.viewingGoal}
        currentAccount={mockAccountSummary}
        onClose={jest.fn()}
      />
    );

    expect(
      screen.queryByTestId(VIEW_GOAL_TEST_IDS.container)
    ).not.toBeInTheDocument();
  });

  it('draws nothing in another mode', () => {
    render(
      <GoalOverlays
        mode={APP_MODE.viewing}
        currentAccount={mockAccountSavingForGoal}
        onClose={jest.fn()}
      />
    );

    expect(
      screen.queryByTestId(VIEW_GOAL_TEST_IDS.container)
    ).not.toBeInTheDocument();
  });
});
