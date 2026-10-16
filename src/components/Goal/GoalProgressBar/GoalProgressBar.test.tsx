import { render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { GoalProgressBar } from './GoalProgressBar';
import { GOAL_PROGRESS_BAR_TEST_IDS, HEAD_START_FILL_PERCENT } from './constants';

const fill = (): HTMLElement => screen.getByTestId(GOAL_PROGRESS_BAR_TEST_IDS.fill);

describe('GoalProgressBar', () => {
  describe('halfway to the goal', () => {
    beforeEach(() => {
      render(<GoalProgressBar savedTowardGoal={createMockSavedTowardGoal({ saved: 15000 })} />);
    });

    it('fills as much of the bar as is saved', () => {
      expect(fill().style.width).toBe('50%');
    });

    it('tells assistive technology how much is saved, in shekels', () => {
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '150');
    });

    it('tells assistive technology the goal amount, in shekels', () => {
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '300');
    });
  });

  describe('with nothing saved yet', () => {
    beforeEach(() => {
      render(<GoalProgressBar savedTowardGoal={createMockSavedTowardGoal({ saved: 0 })} />);
    });

    it('shows a sliver', () => {
      expect(fill().style.width).toBe(`${HEAD_START_FILL_PERCENT}%`);
    });
  });

  describe('with more saved than the goal', () => {
    beforeEach(() => {
      render(
        <GoalProgressBar
          savedTowardGoal={createMockSavedTowardGoal({
            saved: 40000,
            isGoalReached: true,
          })}
        />,
        { themeId: THEME_ID.midnightBlue }
      );
    });

    it('never fills past the whole bar', () => {
      expect(fill().style.width).toBe('100%');
    });

    it('never tells assistive technology more is saved than the goal', () => {
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '300');
    });

    it("starts from the theme's reached colour", () => {
      expect(getComputedStyle(fill()).backgroundImage).toContain(
        getThemeTokens(THEME_ID.midnightBlue).colors.reachedBarStart
      );
    });

    it('fills toward the gain colour of the theme in use', () => {
      expect(getComputedStyle(fill()).backgroundImage).toContain(
        getThemeTokens(THEME_ID.midnightBlue).colors.gainText
      );
    });
  });

  it('is thinner when thin', () => {
    const mockSavedTowardGoal = createMockSavedTowardGoal();
    render(
      <>
        <GoalProgressBar savedTowardGoal={mockSavedTowardGoal} />
        <GoalProgressBar savedTowardGoal={mockSavedTowardGoal} thin />
      </>
    );

    const [fullBar, thinBar] = screen.getAllByTestId(GOAL_PROGRESS_BAR_TEST_IDS.bar);
    expect(parseFloat(getComputedStyle(thinBar).height)).toBeLessThan(
      parseFloat(getComputedStyle(fullBar).height)
    );
  });
});
