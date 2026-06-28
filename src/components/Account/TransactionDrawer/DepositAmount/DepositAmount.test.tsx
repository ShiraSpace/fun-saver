import { render, screen } from '@/test-support/render';
import { DepositAmount } from './DepositAmount';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';

describe('DepositAmount', () => {
  it('shows the whole-shekel amount', () => {
    render(<DepositAmount amount={50} />);

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.amount)
    ).toHaveTextContent('50');
  });
});
