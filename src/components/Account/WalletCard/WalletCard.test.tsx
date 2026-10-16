import { render, screen } from '@/test-utils/render';
import { WalletCard } from './WalletCard';
import { WALLET_CARD_COPY, WALLET_CARD_TEST_IDS } from './constants';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { getThemeTokens, THEME_ID } from '@/theme/registry';

const mockSavingsSubLine = 'צובר 15% בחודש · פעיל מאז 1 בינואר';

describe('WalletCard', () => {
  describe('a spending wallet', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockWalletSummary({
            name: 'spending',
            icon: '🛍️',
            balance: 5000,
          })}
        />
      );
    });

    it('shows the wallet icon', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.card)).toHaveTextContent('🛍️');
    });

    it('shows the localized wallet name', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.card)).toHaveTextContent(
        WALLET_CARD_COPY.name.spending
      );
    });

    it('shows the balance', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.balance)).toHaveTextContent('₪50');
    });
  });

  describe('a wallet nothing has been withdrawn from', () => {
    beforeEach(() => {
      render(<WalletCard wallet={createMockWalletSummary({ name: 'spending', withdrawn: 0 })} />);
    });

    it('stays silent', () => {
      expect(screen.queryByTestId(WALLET_CARD_TEST_IDS.summary)).not.toBeInTheDocument();
    });
  });

  describe('a spending wallet that has been withdrawn from', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockWalletSummary({
            name: 'spending',
            withdrawn: 4500,
          })}
        />
      );
    });

    it('shows what has already been spent', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.summary)).toHaveTextContent('כבר ביזבזת ₪45');
    });
  });

  describe('a good-deeds wallet that has been withdrawn from', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockWalletSummary({
            name: 'goodDeeds',
            withdrawn: 1800,
          })}
        />
      );
    });

    it('shows what has already been given', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.summary)).toHaveTextContent(
        'תרמת ₪18 עד היום'
      );
    });
  });

  describe('a savings wallet', () => {
    beforeEach(() => {
      render(<WalletCard wallet={createMockWalletSummary()} />);
    });

    it('shows the savings rate and opening date as a sub-line', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.summary)).toHaveTextContent(
        mockSavingsSubLine
      );
    });
  });

  describe('a savings wallet that has been withdrawn from', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockWalletSummary({
            name: 'savings',
            withdrawn: 4500,
          })}
        />
      );
    });

    it('keeps its own sub-line rather than the spent one', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.summary)).toHaveTextContent(
        mockSavingsSubLine
      );
    });
  });

  describe('given children', () => {
    beforeEach(() => {
      render(
        <WalletCard wallet={createMockWalletSummary()}>
          <span data-testid="extra" />
        </WalletCard>
      );
    });

    it('renders what it is given below the head', () => {
      expect(screen.getByTestId('extra')).toBeInTheDocument();
    });
  });

  describe('savings kept for a goal', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockWalletSummary({ balance: 29950 })}
          savedTowardGoal={createMockSavedTowardGoal({ saved: 29900 })}
        />
      );
    });

    it('shows a lock on the balance', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.lock)).toBeInTheDocument();
    });

    it('floors the balance, as the goal line does', () => {
      expect(screen.getByTestId(WALLET_CARD_TEST_IDS.balance)).toHaveTextContent('₪299');
    });
  });

  it('shows no lock once the goal is reached', () => {
    render(
      <WalletCard
        wallet={createMockWalletSummary()}
        savedTowardGoal={createMockSavedTowardGoal({ isGoalReached: true })}
      />
    );

    expect(screen.queryByTestId(WALLET_CARD_TEST_IDS.lock)).not.toBeInTheDocument();
  });

  it('floors a balance with agorot when there is no goal', () => {
    render(<WalletCard wallet={createMockWalletSummary({ name: 'spending', balance: 4650 })} />);

    expect(screen.getByTestId(WALLET_CARD_TEST_IDS.balance)).toHaveTextContent('₪46');
  });

  describe('savings once the goal is reached', () => {
    beforeEach(() => {
      render(
        <WalletCard
          wallet={createMockWalletSummary()}
          savedTowardGoal={createMockSavedTowardGoal({ isGoalReached: true })}
        />,
        { themeId: THEME_ID.midnightBlue }
      );
    });

    it("wears the theme's celebration outline", () => {
      expect(getComputedStyle(screen.getByTestId(WALLET_CARD_TEST_IDS.card)).boxShadow).toContain(
        getThemeTokens(THEME_ID.midnightBlue).colors.celebrationOutline
      );
    });

    it('wobbles its piggy bank', () => {
      expect(getComputedStyle(screen.getByTestId(WALLET_CARD_TEST_IDS.icon)).animation).not.toBe(
        ''
      );
    });
  });

  it('wears no celebration outline while savings is kept for the goal', () => {
    render(
      <WalletCard
        wallet={createMockWalletSummary()}
        savedTowardGoal={createMockSavedTowardGoal()}
      />,
      { themeId: THEME_ID.midnightBlue }
    );

    expect(getComputedStyle(screen.getByTestId(WALLET_CARD_TEST_IDS.card)).boxShadow).not.toContain(
      getThemeTokens(THEME_ID.midnightBlue).colors.celebrationOutline
    );
  });
});
