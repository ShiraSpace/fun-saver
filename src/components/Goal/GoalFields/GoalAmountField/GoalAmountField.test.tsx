import { render, screen } from '@/test-utils/render';
import { GoalAmountField } from './GoalAmountField';
import { GOAL_AMOUNT_FIELD_COPY, GOAL_AMOUNT_FIELD_TEST_IDS } from './constants';

const mockNoErrors = { amountMissing: false, amountTooHigh: false };

describe('GoalAmountField', () => {
  it('shows the amount in shekels', () => {
    render(<GoalAmountField amountShekels={300} errors={mockNoErrors} onChange={jest.fn()} />);

    expect(screen.getByTestId(GOAL_AMOUNT_FIELD_TEST_IDS.input)).toHaveValue('300');
  });

  it('stays empty before an amount is typed', () => {
    render(<GoalAmountField amountShekels={0} errors={mockNoErrors} onChange={jest.fn()} />);

    expect(screen.getByTestId(GOAL_AMOUNT_FIELD_TEST_IDS.input)).toHaveValue('');
  });

  it('asks for the amount when it is missing', () => {
    render(
      <GoalAmountField
        amountShekels={0}
        errors={{ ...mockNoErrors, amountMissing: true }}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByTestId(GOAL_AMOUNT_FIELD_TEST_IDS.error)).toHaveTextContent(
      GOAL_AMOUNT_FIELD_COPY.missing
    );
  });

  it('says how high a goal can go when the amount is too high', () => {
    render(
      <GoalAmountField
        amountShekels={999999}
        errors={{ ...mockNoErrors, amountTooHigh: true }}
        onChange={jest.fn()}
      />
    );

    expect(screen.getByTestId(GOAL_AMOUNT_FIELD_TEST_IDS.error)).toHaveTextContent(
      GOAL_AMOUNT_FIELD_COPY.tooHigh
    );
  });
});
