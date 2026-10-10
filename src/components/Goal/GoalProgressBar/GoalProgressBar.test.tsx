import { render, screen } from '@/test-utils/render';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import { GoalProgressBar } from './GoalProgressBar';
import { GOAL_PROGRESS_BAR_TEST_IDS, HEAD_START_PERCENT } from './constants';

const fill = (): HTMLElement =>
  screen.getByTestId(GOAL_PROGRESS_BAR_TEST_IDS.fill);

describe('GoalProgressBar', () => {
  it('fills as much of the bar as is saved', () => {
    render(
      <GoalProgressBar
        savedTowardGoal={createMockSavedTowardGoal({ saved: 15000 })}
      />
    );

    expect(fill().style.width).toBe('50%');
  });

  it('shows a sliver when nothing is saved yet', () => {
    render(
      <GoalProgressBar
        savedTowardGoal={createMockSavedTowardGoal({ saved: 0 })}
      />
    );

    expect(fill().style.width).toBe(`${HEAD_START_PERCENT}%`);
  });

  it('tells assistive technology how much is saved, in shekels', () => {
    render(
      <GoalProgressBar
        savedTowardGoal={createMockSavedTowardGoal({ saved: 8500 })}
      />
    );

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '85'
    );
  });

  it('tells assistive technology the goal amount, in shekels', () => {
    render(<GoalProgressBar savedTowardGoal={createMockSavedTowardGoal()} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuemax',
      '300'
    );
  });

  it('never fills past the whole bar', () => {
    render(
      <GoalProgressBar
        savedTowardGoal={createMockSavedTowardGoal({ saved: 40000 })}
      />
    );

    expect(fill().style.width).toBe('100%');
  });

  it('turns the gain colour once the goal is reached', () => {
    render(
      <GoalProgressBar
        savedTowardGoal={createMockSavedTowardGoal({ reached: true })}
      />
    );

    expect(getComputedStyle(fill()).backgroundColor).toBe(
      hexToRgb(getThemeTokens().colors.gainText)
    );
  });
});
