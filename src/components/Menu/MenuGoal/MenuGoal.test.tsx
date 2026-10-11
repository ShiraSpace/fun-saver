import { fireEvent, render, screen, within } from '@/test-utils/render';
import { WithMenu } from '@/test-utils/menu';
import { mockAccountsContext, createMockAccountsContext } from '@/test-utils/mocks/account.mocks';
import { mockAccountSavingForGoal } from '@/test-utils/mocks/goal.mocks';
import { APP_MODE, AppModeProvider } from '@/components/AccountManagement/app-mode-context';
import { GOAL_PROGRESS_TEST_IDS } from '@/components/Goal/GoalProgress/constants';
import { MenuGoal } from './MenuGoal';
import { MENU_GOAL_TEST_IDS } from './constants';

describe('MenuGoal', () => {
  it('shows nothing without a goal', () => {
    render(
      <WithMenu>
        <MenuGoal />
      </WithMenu>,
      { accounts: mockAccountsContext }
    );

    expect(screen.queryByTestId(MENU_GOAL_TEST_IDS.row)).not.toBeInTheDocument();
  });

  describe('with a goal', () => {
    const mockCloseMenu = jest.fn();
    const mockSetMode = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      render(
        <AppModeProvider value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}>
          <WithMenu closeMenu={mockCloseMenu}>
            <MenuGoal />
          </WithMenu>
        </AppModeProvider>,
        { accounts: createMockAccountsContext({ currentAccount: mockAccountSavingForGoal }) }
      );
    });

    it("shows the goal's progress", () => {
      expect(
        within(screen.getByTestId(MENU_GOAL_TEST_IDS.row)).getByTestId(
          GOAL_PROGRESS_TEST_IDS.heading
        )
      ).toBeInTheDocument();
    });

    it('closes the menu when tapped', () => {
      fireEvent.click(screen.getByTestId(MENU_GOAL_TEST_IDS.row));

      expect(mockCloseMenu).toHaveBeenCalled();
    });

    it('opens the goal screen when tapped', () => {
      fireEvent.click(screen.getByTestId(MENU_GOAL_TEST_IDS.row));

      expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.viewingGoal);
    });
  });
});
