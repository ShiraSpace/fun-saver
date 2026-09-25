import { render, screen } from '@/test-utils/render';
import { DepositSplitPreview } from './DepositSplitPreview';
import { TRANSACTION_DRAWER_TEST_IDS } from '../constants';
import { splitDeposit } from '@/lib/transaction/transactions';
import { agorotToShekels } from '@/lib/money';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';

describe('DepositSplitPreview', () => {
  it('renders each wallet share of the split', () => {
    const split = splitDeposit(20 * AGOROT_PER_SHEKEL);
    render(<DepositSplitPreview split={split} />);

    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.split)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitAmount('savings'))
    ).toHaveTextContent(String(agorotToShekels(split.savings)));
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitAmount('spending'))
    ).toHaveTextContent(String(agorotToShekels(split.spending)));
    expect(
      screen.getByTestId(TRANSACTION_DRAWER_TEST_IDS.splitAmount('goodDeeds'))
    ).toHaveTextContent(String(agorotToShekels(split.goodDeeds)));
  });
});
