import { fireEvent, render, screen, within } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { APP_MODE, AppModeProvider } from '@/components/AccountManagement/app-mode-context';
import { GOAL_PROGRESS_TEST_IDS } from '@/components/Goal/GoalProgress/constants';
import { GoalLine } from './GoalLine';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { hexToRgb } from '@/test-utils/css-color';
import { GOAL_LINE_COPY, GOAL_LINE_TEST_IDS } from './constants';

describe('GoalLine', () => {
  describe('without a goal', () => {
    const mockSetMode = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      render(
        <AppModeProvider value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}>
          <GoalLine />
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

  it("writes the prompt in the theme's strong text colour", () => {
    render(<GoalLine />, { themeId: THEME_ID.midnightBlue });
    const [prompt] = screen.getByTestId(GOAL_LINE_TEST_IDS.setGoal).children;

    expect(getComputedStyle(prompt).color).toBe(
      hexToRgb(getThemeTokens(THEME_ID.midnightBlue).colors.textStrong)
    );
  });

  describe('with a goal', () => {
    const mockSetMode = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      render(
        <AppModeProvider value={{ mode: APP_MODE.viewing, setMode: mockSetMode }}>
          <GoalLine savedTowardGoal={createMockSavedTowardGoal()} />
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
});
