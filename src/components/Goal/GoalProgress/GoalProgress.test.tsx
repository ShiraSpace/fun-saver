import { render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { goalPictureGlow } from '@/test-utils/goal-picture';
import { SAVED_OUT_OF_GOAL_TEST_IDS } from '@/components/Goal/SavedOutOfGoal/constants';
import { GOAL_PROGRESS_BAR_TEST_IDS } from '@/components/Goal/GoalProgressBar/constants';
import { GoalProgress } from './GoalProgress';
import { GOAL_PROGRESS_COPY, GOAL_PROGRESS_SIZE, GOAL_PROGRESS_TEST_IDS } from './constants';

describe('GoalProgress', () => {
  describe('while saving toward the goal', () => {
    beforeEach(() => {
      render(<GoalProgress savedTowardGoal={createMockSavedTowardGoal()} />);
    });

    it('names the goal', () => {
      expect(screen.getByTestId(GOAL_PROGRESS_TEST_IDS.heading)).toHaveTextContent(mockGoal.name);
    });

    it('shows how much is saved toward it', () => {
      expect(screen.getByTestId(SAVED_OUT_OF_GOAL_TEST_IDS.saved)).toHaveTextContent('₪85');
    });
  });

  it('says the goal is reached once it is', () => {
    render(<GoalProgress savedTowardGoal={createMockSavedTowardGoal({ isGoalReached: true })} />);

    expect(screen.getByTestId(GOAL_PROGRESS_TEST_IDS.heading)).toHaveTextContent(
      GOAL_PROGRESS_COPY.reached
    );
  });

  describe('small beside large', () => {
    const heightOf = (element: HTMLElement): number => parseFloat(getComputedStyle(element).height);

    beforeEach(() => {
      const mockSavedTowardGoal = createMockSavedTowardGoal();

      render(
        <>
          <GoalProgress savedTowardGoal={mockSavedTowardGoal} />
          <GoalProgress savedTowardGoal={mockSavedTowardGoal} size={GOAL_PROGRESS_SIZE.large} />
        </>
      );
    });

    it('draws a thicker bar when large', () => {
      const [smallBar, largeBar] = screen.getAllByTestId(GOAL_PROGRESS_BAR_TEST_IDS.bar);

      expect(heightOf(largeBar)).toBeGreaterThan(heightOf(smallBar));
    });

    it('draws a bigger picture when large', () => {
      const [smallPicture, largePicture] = screen.getAllByTestId(GOAL_PROGRESS_TEST_IDS.picture);

      expect(heightOf(largePicture)).toBeGreaterThan(heightOf(smallPicture));
    });
  });

  describe("the picture's glow", () => {
    describe('once reached, when asked to', () => {
      beforeEach(() => {
        render(
          <GoalProgress
            savedTowardGoal={createMockSavedTowardGoal({ isGoalReached: true })}
            glowWhenReached
          />,
          { themeId: THEME_ID.midnightBlue }
        );
      });

      it('glows in the gain colour', () => {
        expect(goalPictureGlow()).toContain(getThemeTokens(THEME_ID.midnightBlue).colors.gainText);
      });
    });

    describe('while still saving, when asked to', () => {
      beforeEach(() => {
        render(<GoalProgress savedTowardGoal={createMockSavedTowardGoal()} glowWhenReached />);
      });

      it('does not glow', () => {
        expect(goalPictureGlow()).toBe('none');
      });
    });

    describe('once reached, without being asked to', () => {
      beforeEach(() => {
        render(
          <GoalProgress savedTowardGoal={createMockSavedTowardGoal({ isGoalReached: true })} />
        );
      });

      it('does not glow', () => {
        expect(goalPictureGlow()).toBe('none');
      });
    });
  });
});
