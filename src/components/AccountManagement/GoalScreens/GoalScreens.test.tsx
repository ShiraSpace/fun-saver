import { render, screen } from '@/test-utils/render';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import type { AccountNavigation } from '@/hooks/use-account-navigation';
import { SET_GOAL_TEST_IDS } from '@/components/Goal/SetGoal/constants';
import { VIEW_GOAL_TEST_IDS } from '@/components/Goal/ViewGoal/constants';
import { APP_MODE } from '../app-mode-context';
import { GoalScreens } from './GoalScreens';

function renderGoalScreens(overrides: Partial<AccountNavigation>): void {
  const mockNavigation: AccountNavigation = {
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

  render(<GoalScreens navigation={mockNavigation} />);
}

describe('GoalScreens', () => {
  describe('while viewing the page', () => {
    beforeEach(() => renderGoalScreens({}));

    it('draws no goal screen', () => {
      expect(screen.queryByTestId(SET_GOAL_TEST_IDS.container)).not.toBeInTheDocument();
    });
  });

  describe('while setting a goal', () => {
    beforeEach(() => renderGoalScreens({ accountSettingGoal: mockAccountSummary }));

    it('draws the screen that sets a goal', () => {
      expect(screen.getByTestId(SET_GOAL_TEST_IDS.container)).toBeInTheDocument();
    });
  });

  describe('while viewing the goal', () => {
    beforeEach(() =>
      renderGoalScreens({
        goalBeingViewed: {
          accountName: mockAccountSummary.name,
          savedTowardGoal: createMockSavedTowardGoal(),
        },
      })
    );

    it('draws the goal screen', () => {
      expect(screen.getByTestId(VIEW_GOAL_TEST_IDS.container)).toBeInTheDocument();
    });
  });
});
