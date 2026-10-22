import { render, screen } from '@/test-utils/render';
import {
  mockWalletSummaries,
  mockWalletSummariesWithAgorot,
} from '@/test-utils/mocks/wallet.mocks';
import { elementsCanAnimate } from '@/test-utils/motion';
import { BalanceBreakdown } from './BalanceBreakdown';
import { BALANCE_BREAKDOWN_COPY, BALANCE_BREAKDOWN_TEST_IDS } from './constants';

describe('BalanceBreakdown', () => {
  it('counts the total up from nothing when the browser allows motion', () => {
    elementsCanAnimate();

    render(<BalanceBreakdown wallets={mockWalletSummaries} />);

    expect(screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.total)).toHaveTextContent('₪0');
  });

  describe('with whole-shekel balances', () => {
    beforeEach(() => {
      render(<BalanceBreakdown wallets={mockWalletSummaries} />);
    });

    it('shows the total across every wallet', () => {
      expect(screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.total)).toHaveTextContent('₪160');
    });

    it('labels the total inside the ring', () => {
      expect(screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.card)).toHaveTextContent(
        BALANCE_BREAKDOWN_COPY.totalLabel
      );
    });

    it('draws the ring', () => {
      expect(screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.donut)).toBeInTheDocument();
    });

    it('lists every wallet in the legend', () => {
      expect(screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendRow)).toHaveLength(
        mockWalletSummaries.length
      );
    });

    it('gives each wallet its share of the total', () => {
      expect(screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendShare)[0]).toHaveTextContent(
        '53%'
      );
    });
  });

  describe('when a balance has agorot', () => {
    beforeEach(() => {
      render(<BalanceBreakdown wallets={mockWalletSummariesWithAgorot} />);
    });

    it('totals the balances after rounding each one down', () => {
      expect(screen.getByTestId(BALANCE_BREAKDOWN_TEST_IDS.total)).toHaveTextContent('₪106');
    });

    it('rounds the balance in the legend down', () => {
      expect(screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendBalance)[0]).toHaveTextContent(
        '₪46'
      );
    });

    it('gives each wallet its share of the rounded-down total', () => {
      expect(screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendShare)[0]).toHaveTextContent(
        '43%'
      );
    });
  });
});
