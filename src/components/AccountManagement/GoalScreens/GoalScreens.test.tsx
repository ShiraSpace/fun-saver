import { render, screen } from '@/test-utils/render';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import type { AccountNavigation } from '@/hooks/use-account-navigation';
import { SET_GOAL_TEST_IDS } from '@/components/Goal/SetGoal/constants';
import { VIEW_GOAL_TEST_IDS } from '@/components/Goal/ViewGoal/constants';
import { APP_MODE } from '../app-mode-context';
import { GoalScreens } from './GoalScreens';

function renderGoalScreens(overrides: Partial<AccountNavigation>): void {
  const navigation: AccountNavigation = {
    mode: APP_MODE.viewing,
    setMode: () => {},
    currentAccount: mockAccountSummary,
    switchAccount: () => {},
    showNewAccount: () => {},
    finishEditing: () => {},
    cancel: () => {},
    isCreating: false,
    ...overrides,
  };

  render(<GoalScreens navigation={navigation} />);
}

describe('GoalScreens', () => {
  it('draws no goal screen while viewing the page', () => {
    renderGoalScreens({});

    expect(screen.queryByTestId(SET_GOAL_TEST_IDS.container)).not.toBeInTheDocument();
  });

  it('draws the screen that sets a goal while setting one', () => {
    renderGoalScreens({ mode: APP_MODE.settingGoal });

    expect(screen.getByTestId(SET_GOAL_TEST_IDS.container)).toBeInTheDocument();
  });

  it('draws the goal screen while viewing the goal', () => {
    renderGoalScreens({
      mode: APP_MODE.viewingGoal,
      goalBeingViewed: {
        accountName: mockAccountSummary.name,
        savedTowardGoal: createMockSavedTowardGoal(),
      },
    });

    expect(screen.getByTestId(VIEW_GOAL_TEST_IDS.container)).toBeInTheDocument();
  });
});
