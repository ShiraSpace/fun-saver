import { render, screen } from '@/test-utils/render';
import { GoalNameField } from './GoalNameField';
import { GOAL_NAME_FIELD_COPY, GOAL_NAME_FIELD_TEST_IDS } from './constants';

describe('GoalNameField', () => {
  it('shows the goal name', () => {
    render(<GoalNameField goalName="אופניים" missing={false} onChange={jest.fn()} />);

    expect(screen.getByTestId(GOAL_NAME_FIELD_TEST_IDS.input)).toHaveValue('אופניים');
  });

  it('asks for the name when it is missing', () => {
    render(<GoalNameField goalName="" missing onChange={jest.fn()} />);

    expect(screen.getByTestId(GOAL_NAME_FIELD_TEST_IDS.error)).toHaveTextContent(
      GOAL_NAME_FIELD_COPY.missing
    );
  });
});
