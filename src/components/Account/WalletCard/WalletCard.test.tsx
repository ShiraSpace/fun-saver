import { render, screen } from '@/test-utils/render';
import { WalletCard } from './WalletCard';
import { WALLET_CARD_TEST_IDS } from './constants';
import { createMockDerivedWallet } from '@/test-utils/fixtures';

describe('WalletCard', () => {
  it('shows the wallet icon, localized name and balance', () => {
    render(
      <WalletCard
        wallet={createMockDerivedWallet({
          name: 'spending',
          icon: '🛍️',
          balance: 5000,
        })}
      />
    );
    const card = screen.getByTestId(WALLET_CARD_TEST_IDS.card);
    expect(card).toHaveTextContent('🛍️');
    expect(card).toHaveTextContent('בזבוזים');
    expect(screen.getByTestId(WALLET_CARD_TEST_IDS.balance)).toHaveTextContent(
      '₪50'
    );
  });
});
