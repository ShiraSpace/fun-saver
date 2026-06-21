import { render, screen } from '@testing-library/react';
import { WalletList } from './WalletList';
import { WALLET_LIST_COPY, WALLET_LIST_TEST_IDS } from './constants';
import { WALLET_CARD_TEST_IDS } from '../WalletCard/constants';

const wallets = [
  { id: 'w2', name: 'spending' as const, icon: '🛍️', balance: 5000 },
  { id: 'w3', name: 'goodDeeds' as const, icon: '💛', balance: 2500 },
];

describe('WalletList', () => {
  beforeEach(() => {
    render(<WalletList wallets={wallets} />);
  });

  it('shows the supporting label', () => {
    expect(screen.getByTestId(WALLET_LIST_TEST_IDS.label)).toHaveTextContent(
      WALLET_LIST_COPY.label
    );
  });

  it('renders one card per wallet', () => {
    expect(screen.getAllByTestId(WALLET_CARD_TEST_IDS.card)).toHaveLength(2);
  });
});
