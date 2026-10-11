import { render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { SAVED_OUT_OF_GOAL_TEST_IDS } from '@/components/Goal/SavedOutOfGoal/constants';
import { GOAL_PROGRESS_BAR_TEST_IDS } from '@/components/Goal/GoalProgressBar/constants';
import { GoalProgress } from './GoalProgress';
import { GOAL_PROGRESS_COPY, GOAL_PROGRESS_SIZE, GOAL_PROGRESS_TEST_IDS } from './constants';

const pictureGlow = (): string =>
  getComputedStyle(screen.getByTestId(GOAL_PROGRESS_TEST_IDS.picture)).boxShadow;

const heightOf = (element: HTMLElement): number => parseFloat(getComputedStyle(element).height);

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
    render(<GoalProgress savedTowardGoal={createMockSavedTowardGoal({ reached: true })} />);
    expect(screen.getByTestId(GOAL_PROGRESS_TEST_IDS.heading)).toHaveTextContent(
      GOAL_PROGRESS_COPY.reached
    );
  });

  describe('small beside large', () => {
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

  it('glows in the gain colour once reached, when asked to', () => {
    render(
      <GoalProgress
        savedTowardGoal={createMockSavedTowardGoal({ reached: true })}
        glowWhenReached
      />,
      { themeId: THEME_ID.midnightBlue }
    );

    expect(pictureGlow()).toContain(getThemeTokens(THEME_ID.midnightBlue).colors.gainText);
  });

  it('does not glow while still saving', () => {
    render(<GoalProgress savedTowardGoal={createMockSavedTowardGoal()} glowWhenReached />);

    expect(pictureGlow()).toBe('none');
  });

  it('does not glow once reached unless asked to', () => {
    render(<GoalProgress savedTowardGoal={createMockSavedTowardGoal({ reached: true })} />);

    expect(pictureGlow()).toBe('none');
  });
});
