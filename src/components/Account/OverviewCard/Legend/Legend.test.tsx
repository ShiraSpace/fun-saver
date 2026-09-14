import { render, screen } from '@/test-utils/render';
import { mockDerivedWallets, mockWalletShares } from '@/test-utils/fixtures';
import { Legend } from './Legend';
import { OVERVIEW_CARD_COPY, OVERVIEW_CARD_TEST_IDS } from '../constants';

const entries = mockDerivedWallets.map((wallet, index) => ({
  id: wallet.id,
  name: wallet.name,
  icon: wallet.icon,
  balance: wallet.balance,
  share: mockWalletShares[index],
}));

describe('Legend', () => {
  beforeEach(() => {
    render(<Legend entries={entries} />);
  });

  it('shows one row per wallet', () => {
    expect(
      screen.getAllByTestId(OVERVIEW_CARD_TEST_IDS.legendRow)
    ).toHaveLength(entries.length);
  });

  it('names each wallet in Hebrew', () => {
    expect(
      screen.getAllByTestId(OVERVIEW_CARD_TEST_IDS.legendRow)[0]
    ).toHaveTextContent(OVERVIEW_CARD_COPY.name.savings);
  });

  it("shows each wallet's icon in its square", () => {
    expect(
      screen.getAllByTestId(OVERVIEW_CARD_TEST_IDS.legendRow)[0]
    ).toHaveTextContent(mockDerivedWallets[0].icon);
  });

  it('shows the share of each wallet as a percentage', () => {
    expect(
      screen.getAllByTestId(OVERVIEW_CARD_TEST_IDS.legendShare)[0]
    ).toHaveTextContent('53%');
  });

  it('shows the balance of each wallet', () => {
    expect(
      screen.getAllByTestId(OVERVIEW_CARD_TEST_IDS.legendAmount)[0]
    ).toHaveTextContent('₪85');
  });

  it('renders the wallets in the order it is given', () => {
    expect(
      screen.getAllByTestId(OVERVIEW_CARD_TEST_IDS.legendAmount)[2]
    ).toHaveTextContent('₪25');
  });
});
