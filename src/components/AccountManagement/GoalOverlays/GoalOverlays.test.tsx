import { render, screen } from '@/test-utils/render';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { VIEW_GOAL_TEST_IDS } from '@/components/Goal/ViewGoal/constants';
import { APP_MODE } from '../app-mode-context';
import { GoalOverlays } from './GoalOverlays';

const mockAccountWithGoal = { ...mockAccountSummary, goal: mockGoal };

describe('GoalOverlays', () => {
  it('shows the goal screen while viewing the goal', () => {
    render(
      <GoalOverlays
        mode={APP_MODE.viewingGoal}
        currentAccount={mockAccountWithGoal}
        onClose={jest.fn()}
      />
    );

    expect(
      screen.getByTestId(VIEW_GOAL_TEST_IDS.container)
    ).toBeInTheDocument();
  });

  it('shows nothing when the account has no goal any more', () => {
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

  it('shows nothing while not viewing the goal', () => {
    render(
      <GoalOverlays
        mode={APP_MODE.viewing}
        currentAccount={mockAccountWithGoal}
        onClose={jest.fn()}
      />
    );

    expect(
      screen.queryByTestId(VIEW_GOAL_TEST_IDS.container)
    ).not.toBeInTheDocument();
  });
});
