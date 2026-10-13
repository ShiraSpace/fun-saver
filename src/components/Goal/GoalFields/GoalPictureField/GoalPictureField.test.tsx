import { fireEvent, render, screen } from '@/test-utils/render';
import { DEFAULT_GOAL_PICTURE } from '@/lib/goal/constants';
import { createMockGoalPicture } from '@/test-utils/mocks/goal.mocks';
import { GoalPictureField } from './GoalPictureField';
import { GOAL_PICTURE_FIELD_TEST_IDS } from './constants';

describe('GoalPictureField', () => {
  it('shows 🎯 before a picture is chosen', () => {
    render(<GoalPictureField picture={null} onSearch={jest.fn()} />);

    expect(screen.getByTestId(GOAL_PICTURE_FIELD_TEST_IDS.preview)).toHaveTextContent(
      DEFAULT_GOAL_PICTURE.emoji
    );
  });

  it('shows the chosen picture', () => {
    render(<GoalPictureField picture={createMockGoalPicture('🚲')} onSearch={jest.fn()} />);

    expect(screen.getByTestId(GOAL_PICTURE_FIELD_TEST_IDS.preview)).toHaveTextContent('🚲');
  });

  it('opens the search when the picture is tapped', () => {
    const mockOnSearch = jest.fn();
    render(<GoalPictureField picture={null} onSearch={mockOnSearch} />);

    fireEvent.click(screen.getByTestId(GOAL_PICTURE_FIELD_TEST_IDS.preview));

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});
