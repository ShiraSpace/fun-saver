import { render, screen } from '@/test-utils/render';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { GoalNameField } from './GoalNameField';
import { GOAL_NAME_FIELD_COPY, GOAL_NAME_FIELD_TEST_IDS } from './constants';

describe('GoalNameField', () => {
  describe('with a name', () => {
    beforeEach(() => {
      render(<GoalNameField goalName={mockGoal.name} missing={false} onChange={jest.fn()} />);
    });

    it('shows the goal name', () => {
      expect(screen.getByTestId(GOAL_NAME_FIELD_TEST_IDS.input)).toHaveValue(mockGoal.name);
    });
  });

  describe('when the name is missing', () => {
    beforeEach(() => {
      render(<GoalNameField goalName="" missing onChange={jest.fn()} />);
    });

    it('asks for the name', () => {
      expect(screen.getByTestId(GOAL_NAME_FIELD_TEST_IDS.error)).toHaveTextContent(
        GOAL_NAME_FIELD_COPY.missing
      );
    });
  });
});
