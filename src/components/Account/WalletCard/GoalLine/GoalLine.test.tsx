import { fireEvent, render, screen, within } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import {
  createMockSpendableWallet,
  createMockWalletSummary,
} from '@/test-utils/mocks/wallet.mocks';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { APP_MODE, AppModeProvider } from '@/components/AccountManagement/app-mode-context';
import { GOAL_PROGRESS_TEST_IDS } from '@/components/Goal/GoalProgress/constants';
import { GoalLine } from './GoalLine';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { hexToRgb } from '@/test-utils/css-color';
import { moves } from '@/test-utils/motion';
import { GOAL_LINE_COPY, GOAL_LINE_TEST_IDS } from './constants';

describe('GoalLine', () => {
  const mockSavingsWallet = createMockWalletSummary();

  describe('without a goal', () => {
    const mockSetMode = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      render(
        <AppModeProvider value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}>
          <GoalLine wallet={mockSavingsWallet} />
        </AppModeProvider>
      );
    });

    it('offers to set a goal', () => {
      expect(screen.getByTestId(GOAL_LINE_TEST_IDS.setGoal)).toHaveTextContent(
        GOAL_LINE_COPY.setGoal
      );
    });

    it('shows no progress', () => {
      expect(screen.queryByTestId(GOAL_LINE_TEST_IDS.line)).not.toBeInTheDocument();
    });

    it('opens the screen that sets a goal when tapped', () => {
      fireEvent.click(screen.getByTestId(GOAL_LINE_TEST_IDS.setGoal));

      expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.settingGoal);
    });
  });

  describe('without a goal in a theme other than the default', () => {
    beforeEach(() => {
      render(<GoalLine wallet={mockSavingsWallet} />, { themeId: THEME_ID.midnightBlue });
    });

    it("writes the prompt in the theme's strong text colour", () => {
      const [prompt] = screen.getByTestId(GOAL_LINE_TEST_IDS.setGoal).children;

      expect(getComputedStyle(prompt).color).toBe(
        hexToRgb(getThemeTokens(THEME_ID.midnightBlue).colors.textStrong)
      );
    });
  });

  describe('with a goal', () => {
    const mockSetMode = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      render(
        <AppModeProvider value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}>
          <GoalLine wallet={mockSavingsWallet} savedTowardGoal={createMockSavedTowardGoal()} />
        </AppModeProvider>
      );
    });

    it("shows the goal's progress", () => {
      expect(
        within(screen.getByTestId(GOAL_LINE_TEST_IDS.line)).getByTestId(
          GOAL_PROGRESS_TEST_IDS.heading
        )
      ).toBeInTheDocument();
    });

    it('opens the goal screen when tapped', () => {
      fireEvent.click(screen.getByTestId(GOAL_LINE_TEST_IDS.line));

      expect(mockSetMode).toHaveBeenCalledWith(APP_MODE.viewingGoal);
    });
  });

  describe('on a wallet other than savings', () => {
    beforeEach(() => {
      render(<GoalLine wallet={createMockSpendableWallet(WALLET_NAMES.spending)} />);
    });

    it('offers no goal', () => {
      expect(screen.queryByTestId(GOAL_LINE_TEST_IDS.setGoal)).not.toBeInTheDocument();
    });
  });

  it('celebrates a reached goal by wobbling its picture', () => {
    render(
      <GoalLine
        wallet={mockSavingsWallet}
        savedTowardGoal={createMockSavedTowardGoal({ isGoalReached: true })}
      />
    );

    expect(moves(screen.getByTestId(GOAL_PROGRESS_TEST_IDS.picture))).toBe(true);
  });
});
