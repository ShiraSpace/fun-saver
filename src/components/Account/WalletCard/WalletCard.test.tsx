import { render, screen } from '@/test-utils/render';
import { WalletCard } from './WalletCard';
import { WALLET_CARD_COPY, WALLET_CARD_TEST_IDS } from './constants';
import { createMockDerivedWallet } from '@/test-utils/fixtures';

const SAVINGS_SUB_LINE = 'צובר 15% בחודש · פעיל מאז 1 בינואר';

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

  describe('a wallet nothing has been withdrawn from', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockDerivedWallet({ name: 'spending', withdrawals: 0 })}
        />
      );
    });

    it('stays silent', () => {
      expect(
        screen.queryByTestId(WALLET_CARD_TEST_IDS.summary)
      ).not.toBeInTheDocument();
    });
  });

  describe('a spending wallet that has been withdrawn from', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockDerivedWallet({
            name: 'spending',
            withdrawals: 4500,
          })}
        />
      );
    });

    it('shows what has already been spent', () => {
      expect(
        screen.getByTestId(WALLET_CARD_TEST_IDS.summary)
      ).toHaveTextContent('כבר ביזבזת ₪45');
    });
  });

  describe('a good-deeds wallet that has been withdrawn from', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockDerivedWallet({
            name: 'goodDeeds',
            withdrawals: 1800,
          })}
        />
      );
    });

    it('shows what has already been given', () => {
      expect(
        screen.getByTestId(WALLET_CARD_TEST_IDS.summary)
      ).toHaveTextContent('תרמת ₪18 עד היום');
    });
  });

  describe('a savings wallet', () => {
    beforeEach(() => {
      render(<WalletCard wallet={createMockDerivedWallet()} />);
    });

    it('shows the savings rate and opening date as a sub-line', () => {
      expect(
        screen.getByTestId(WALLET_CARD_TEST_IDS.summary)
      ).toHaveTextContent(SAVINGS_SUB_LINE);
    });
  });

  describe('a savings wallet that has been withdrawn from', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockDerivedWallet({
            name: 'savings',
            withdrawals: 4500,
          })}
        />
      );
    });

    it('keeps its own sub-line rather than the spent one', () => {
      expect(
        screen.getByTestId(WALLET_CARD_TEST_IDS.summary)
      ).toHaveTextContent(SAVINGS_SUB_LINE);
    });
  });

  describe('given children', () => {
    beforeEach(() => {
      render(
        <WalletCard wallet={createMockDerivedWallet()}>
          <span data-testid="extra" />
        </WalletCard>
      );
    });

    it('renders what it is given below the head', () => {
      expect(screen.getByTestId('extra')).toBeInTheDocument();
    });
  });
});
