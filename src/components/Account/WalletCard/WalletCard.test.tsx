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

  it('stays silent about a wallet nothing has been withdrawn from', () => {
    render(
      <WalletCard
        wallet={createMockDerivedWallet({ name: 'spending', withdrawals: 0 })}
      />
    );

    expect(
      screen.queryByTestId(WALLET_CARD_TEST_IDS.subLine)
    ).not.toBeInTheDocument();
  });

  it('shows what has already been spent', () => {
    render(
      <WalletCard
        wallet={createMockDerivedWallet({
          name: 'spending',
          withdrawals: 4500,
        })}
      />
    );

    expect(screen.getByTestId(WALLET_CARD_TEST_IDS.subLine)).toHaveTextContent(
      'כבר ביזבזת ₪45'
    );
  });

  it('shows what has already been given', () => {
    render(
      <WalletCard
        wallet={createMockDerivedWallet({
          name: 'goodDeeds',
          withdrawals: 1800,
        })}
      />
    );

    expect(screen.getByTestId(WALLET_CARD_TEST_IDS.subLine)).toHaveTextContent(
      'תרמת ₪18 עד היום'
    );
  });

  it('shows the savings rate and opening date as a sub-line', () => {
    render(<WalletCard wallet={createMockDerivedWallet()} />);

    expect(screen.getByTestId(WALLET_CARD_TEST_IDS.subLine)).toHaveTextContent(
      'צובר 15% בחודש · פעיל מאז 1 בינואר'
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
