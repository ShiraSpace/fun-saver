import { fireEvent, render, screen } from '@/test-utils/render';
import {
  createMockAccountsContext,
  mockAccountsContext,
  mockAccountSummary,
} from '@/test-utils/mocks/account.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { WithMenu } from '@/test-utils/menu';
import {
  APP_MODE,
  AppModeProvider,
} from '@/components/AccountManagement/app-mode-context';
import { SAVED_OF_GOAL_TEST_IDS } from '@/components/Goal/SavedOfGoal/constants';
import { MenuGoal } from './MenuGoal';
import { MENU_GOAL_TEST_IDS } from './constants';

describe('MenuGoal', () => {
  it('shows nothing for an account without a goal', () => {
    render(
      <WithMenu closeMenu={jest.fn()}>
        <MenuGoal />
      </WithMenu>,
      { accounts: mockAccountsContext }
    );

    expect(
      screen.queryByTestId(MENU_GOAL_TEST_IDS.row)
    ).not.toBeInTheDocument();
  });

  describe('for an account with a goal', () => {
    const mockCloseMenu = jest.fn();
    const mockSetMode = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      render(
        <AppModeProvider
          value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}
        >
          <WithMenu closeMenu={mockCloseMenu}>
            <MenuGoal />
          </WithMenu>
        </AppModeProvider>,
        {
          accounts: createMockAccountsContext({
            currentAccount: { ...mockAccountSummary, goal: mockGoal },
          }),
        }
      );
    });

    it('names the goal', () => {
      expect(screen.getByTestId(MENU_GOAL_TEST_IDS.name)).toHaveTextContent(
        mockGoal.name
      );
    });

    it('shows how much is saved toward it', () => {
      expect(
        screen.getByTestId(SAVED_OF_GOAL_TEST_IDS.saved)
      ).toHaveTextContent('₪85');
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
