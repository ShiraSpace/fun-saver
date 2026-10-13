import { fireEvent, render, screen } from '@/test-utils/render';
import { DEFAULT_GOAL_PICTURE } from '@/lib/goal/constants';
import { createMockGoalPicture } from '@/test-utils/mocks/goal.mocks';
import { GoalPictureField } from './GoalPictureField';
import { GOAL_PICTURE_FIELD_TEST_IDS } from './constants';

describe('GoalPictureField', () => {
  describe('before a picture is chosen', () => {
    const mockOnSearch = jest.fn();

    beforeEach(() => {
      mockOnSearch.mockClear();
      render(<GoalPictureField picture={null} onSearch={mockOnSearch} />);
    });

    it('shows 🎯', () => {
      expect(screen.getByTestId(GOAL_PICTURE_FIELD_TEST_IDS.preview)).toHaveTextContent(
        DEFAULT_GOAL_PICTURE.emoji
      );
    });

    it('opens the search when the picture is tapped', () => {
      fireEvent.click(screen.getByTestId(GOAL_PICTURE_FIELD_TEST_IDS.preview));

      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('with a chosen picture', () => {
    beforeEach(() => {
      render(<GoalPictureField picture={createMockGoalPicture('🚲')} onSearch={jest.fn()} />);
    });

    it('shows the chosen picture', () => {
      expect(screen.getByTestId(GOAL_PICTURE_FIELD_TEST_IDS.preview)).toHaveTextContent('🚲');
    });
  });
});
