import { render, screen } from '@/test-utils/render';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';
import { prefersReducedMotion } from '@/test-utils/motion';
import { BalanceBreakdown } from './BalanceBreakdown';
import {
  BALANCE_BREAKDOWN_COPY,
  BALANCE_BREAKDOWN_TEST_IDS,
} from './constants';

describe('BalanceBreakdown', () => {
  beforeEach(() => {
    prefersReducedMotion();
    render(<BalanceBreakdown wallets={mockWalletSummaries} />);
  });

  it('shows the total across every wallet', () => {
    expect(
      screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.total)
    ).toHaveTextContent('₪160');
  });

  it('labels the total inside the ring', () => {
    expect(
      screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.card)
    ).toHaveTextContent(BALANCE_BREAKDOWN_COPY.totalLabel);
  });

  it('draws the ring', () => {
    expect(
      screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.donut)
    ).toBeInTheDocument();
  });

  it('lists every wallet in the legend', () => {
    expect(
      screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendRow)
    ).toHaveLength(mockWalletSummaries.length);
  });

  it('gives each wallet its share of the total', () => {
    expect(
      screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendShare)[0]
    ).toHaveTextContent('53%');
  });
});
