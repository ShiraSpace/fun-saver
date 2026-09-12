import { render, screen } from '@/test-utils/render';
import { WalletCard } from './WalletCard';
import { WALLET_CARD_COPY, WALLET_CARD_TEST_IDS } from './constants';
import { createMockDerivedWallet } from '@/test-utils/fixtures';

describe('WalletCard', () => {
  describe('a spending wallet', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockDerivedWallet({
            name: 'spending',
            icon: '🛍️',
            balance: 5000,
          })}
        />
      );
    });

    it('shows the wallet icon', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.card)).toHaveTextContent(
        '🛍️'
      );
    });

    it('shows the localized wallet name', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.card)).toHaveTextContent(
        WALLET_CARD_COPY.name.spending
      );
    });

    it('shows the balance', () => {
      expect(
        screen.getByTestId(WALLET_CARD_TEST_IDS.balance)
      ).toHaveTextContent('₪50');
    });
  });

  it('shows no sub-line for a wallet without one', () => {
    render(
      <WalletCard wallet={createMockDerivedWallet({ name: 'spending' })} />
    );

    expect(
      screen.queryByTestId(WALLET_CARD_TEST_IDS.subLine)
    ).not.toBeInTheDocument();
  });

  it('shows the savings rate and opening date as a sub-line', () => {
    const wallet = createMockDerivedWallet();

    render(<WalletCard wallet={wallet} />);

    expect(screen.getByTestId(WALLET_CARD_TEST_IDS.subLine)).toHaveTextContent(
      WALLET_CARD_COPY.savingsSubLine(
        wallet.monthlyInterestRate,
        wallet.openedAt
      )
    );
  });

  it('renders what it is given below the head', () => {
    render(
      <WalletCard wallet={createMockDerivedWallet()}>
        <span data-testid="extra" />
      </WalletCard>
    );

    expect(screen.getByTestId('extra')).toBeInTheDocument();
  });
});
