import { render, screen } from '@/test-utils/render';
import { mockDerivedWallets, mockWalletShares } from '@/test-utils/fixtures';
import { Legend } from './Legend';
import {
  LEGEND_ANIMATION,
  BALANCE_BREAKDOWN_COPY,
  BALANCE_BREAKDOWN_TEST_IDS,
} from '../constants';

const walletsWithShare = mockDerivedWallets.map((wallet, index) => ({
  id: wallet.id,
  name: wallet.name,
  icon: wallet.icon,
  balance: wallet.balance,
  share: mockWalletShares[index],
}));

function rowDelayMs(row: Element): number {
  return Number.parseFloat(getComputedStyle(row).animationDelay);
}

describe('Legend', () => {
  beforeEach(() => {
    render(<Legend wallets={walletsWithShare} />);
  });

  it('shows one row per wallet', () => {
    expect(
      screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendRow)
    ).toHaveLength(walletsWithShare.length);
  });

  it('names each wallet in Hebrew', () => {
    expect(
      screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendRow)[0]
    ).toHaveTextContent(BALANCE_BREAKDOWN_COPY.shortWalletLabel.savings);
  });

  it("shows each wallet's icon in its square", () => {
    expect(
      screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendDot)[0]
    ).toHaveTextContent(mockDerivedWallets[0].icon);
  });

  it('starts each row a beat after the one above it', () => {
    const [first, second] = screen.getAllByTestId(
      BALANCE_BREAKDOWN_TEST_IDS.legendRow
    );
    const betweenRowsMs = rowDelayMs(second) - rowDelayMs(first);

    expect(betweenRowsMs).toBe(LEGEND_ANIMATION.betweenRowsMs);
  });

  it('shows the share of each wallet as a percentage', () => {
    expect(
      screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendShare)[0]
    ).toHaveTextContent('53%');
  });

  it('shows the balance of each wallet', () => {
    expect(
      screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendBalance)[0]
    ).toHaveTextContent('₪85');
  });

  it('renders the wallets in the order it is given', () => {
    expect(
      screen.getAllByTestId(BALANCE_BREAKDOWN_TEST_IDS.legendBalance)[2]
    ).toHaveTextContent('₪25');
  });
});
