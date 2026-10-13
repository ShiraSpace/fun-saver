import { render, screen } from '@/test-utils/render';
import { GoalAmountField } from './GoalAmountField';
import { GOAL_AMOUNT_FIELD_COPY, GOAL_AMOUNT_FIELD_TEST_IDS } from './constants';

const mockNoErrors = { amountMissing: false, amountTooHigh: false };

describe('GoalAmountField', () => {
  describe('with an amount', () => {
    beforeEach(() => {
      render(<GoalAmountField amountShekels={300} errors={mockNoErrors} onChange={jest.fn()} />);
    });

    it('shows the amount in shekels', () => {
      expect(screen.getByTestId(GOAL_AMOUNT_FIELD_TEST_IDS.input)).toHaveValue('300');
    });
  });

  describe('before an amount is typed', () => {
    beforeEach(() => {
      render(<GoalAmountField amountShekels={0} errors={mockNoErrors} onChange={jest.fn()} />);
    });

    it('stays empty', () => {
      expect(screen.getByTestId(GOAL_AMOUNT_FIELD_TEST_IDS.input)).toHaveValue('');
    });
  });

  describe('when the amount is missing', () => {
    beforeEach(() => {
      render(
        <GoalAmountField
          amountShekels={0}
          errors={{ ...mockNoErrors, amountMissing: true }}
          onChange={jest.fn()}
        />
      );
    });

    it('asks for the amount', () => {
      expect(screen.getByTestId(GOAL_AMOUNT_FIELD_TEST_IDS.error)).toHaveTextContent(
        GOAL_AMOUNT_FIELD_COPY.missing
      );
    });
  });

  describe('when the amount is too high', () => {
    beforeEach(() => {
      render(
        <GoalAmountField
          amountShekels={999999}
          errors={{ ...mockNoErrors, amountTooHigh: true }}
          onChange={jest.fn()}
        />
      );
    });

    it('says how high a goal can go', () => {
      expect(screen.getByTestId(GOAL_AMOUNT_FIELD_TEST_IDS.error)).toHaveTextContent(
        GOAL_AMOUNT_FIELD_COPY.tooHigh
      );
    });
  });
});
