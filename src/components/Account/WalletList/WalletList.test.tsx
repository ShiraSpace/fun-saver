import { render, screen } from '@/test-utils/render';
import { WalletList } from './WalletList';
import { WALLET_LIST_COPY, WALLET_LIST_TEST_IDS } from './constants';
import { WALLET_CARD_TEST_IDS } from '../WalletCard/constants';
import { mockDerivedWallets } from '@/test-utils/fixtures';

describe('WalletList', () => {
  beforeEach(() => {
    render(<WalletList wallets={mockDerivedWallets} />);
  });

  it('shows the supporting label', () => {
    expect(screen.getByTestId(WALLET_LIST_TEST_IDS.label)).toHaveTextContent(
      WALLET_LIST_COPY.label
    );
  });

  it('renders one card per wallet', () => {
    expect(screen.getAllByTestId(WALLET_CARD_TEST_IDS.card)).toHaveLength(3);
  });
});
