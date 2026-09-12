import { render, screen } from '@/test-support/render';
import { DepositSplit } from './DepositSplit';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { splitDeposit } from '@/lib/transactions';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';

describe('DepositSplit', () => {
  it('renders each wallet share of the split', () => {
    const split = splitDeposit(20 * AGOROT_PER_SHEKEL);
    render(<DepositSplit split={split} />);

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.split)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitShare('savings'))
    ).toHaveTextContent(String(agorotToShekels(split.savings)));
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitShare('spending'))
    ).toHaveTextContent(String(agorotToShekels(split.spending)));
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitShare('goodDeeds'))
    ).toHaveTextContent(String(agorotToShekels(split.goodDeeds)));
  });
});
