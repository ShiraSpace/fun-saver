import { render, screen } from '@/test-utils/render';
import { mockDerivedWallets, mockWalletShares } from '@/test-utils/fixtures';
import { OverviewCard } from './OverviewCard';
import { OVERVIEW_CARD_COPY, OVERVIEW_CARD_TEST_IDS } from './constants';

describe('OverviewCard', () => {
  beforeEach(() => {
    render(<OverviewCard wallets={mockDerivedWallets} />);
  });

  it('shows the total across every wallet', () => {
    expect(screen.getByTestId(OVERVIEW_CARD_TEST_IDS.total)).toHaveTextContent(
      '₪160'
    );
  });

  it('labels the total inside the ring', () => {
    expect(screen.getByTestId(OVERVIEW_CARD_TEST_IDS.card)).toHaveTextContent(
      OVERVIEW_CARD_COPY.totalLabel
    );
  });

  it('draws the ring', () => {
    expect(
      screen.getByTestId(OVERVIEW_CARD_TEST_IDS.donut)
    ).toBeInTheDocument();
  });

  it('lists every wallet in the legend', () => {
    expect(
      screen.getAllByTestId(OVERVIEW_CARD_TEST_IDS.legendRow)
    ).toHaveLength(mockDerivedWallets.length);
  });

  it('gives each wallet its share of the total', () => {
    expect(
      screen.getAllByTestId(OVERVIEW_CARD_TEST_IDS.legendShare)[0]
    ).toHaveTextContent(OVERVIEW_CARD_COPY.share(mockWalletShares[0]));
  });
});
