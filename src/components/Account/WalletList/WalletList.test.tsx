import { render, screen, within } from '@/test-utils/render';
import { opacityOf } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import { WalletList } from './WalletList';
import { WALLET_LIST_COPY, WALLET_LIST_TEST_IDS } from './constants';
import { WALLET_CARD_TEST_IDS } from '../WalletCard/constants';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';
import { createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import { GOAL_PROGRESS_TEST_IDS } from '../WalletCard/GoalProgress/constants';

describe('WalletList', () => {
  describe('without a goal', () => {
    beforeEach(() => {
      render(<WalletList wallets={mockWalletSummaries} />);
    });

    it('shows the supporting label', () => {
      expect(screen.getByTestId(WALLET_LIST_TEST_IDS.label)).toHaveTextContent(
        WALLET_LIST_COPY.label
      );
    });

    it('lays the theme scrim behind the label instead of fading it', () => {
      const label = screen.getByTestId(WALLET_LIST_TEST_IDS.label);

      expect(getComputedStyle(label).backgroundColor).toBe(
        getThemeTokens().colors.labelShade
      );
      expect(opacityOf(label)).toBe(1);
    });

    it('renders one card per wallet', () => {
      expect(screen.getAllByTestId(WALLET_CARD_TEST_IDS.card)).toHaveLength(3);
    });

    it('shows no goal line', () => {
      expect(
        screen.queryByTestId(GOAL_PROGRESS_TEST_IDS.line)
      ).not.toBeInTheDocument();
    });
  });

  describe('with a goal', () => {
    beforeEach(() => {
      render(
        <WalletList
          wallets={mockWalletSummaries}
          savedTowardGoal={createMockSavedTowardGoal()}
        />
      );
    });

    it('puts the goal line on the savings card', () => {
      const [savingsCard] = screen.getAllByTestId(WALLET_CARD_TEST_IDS.card);

      expect(
        within(savingsCard).getByTestId(GOAL_PROGRESS_TEST_IDS.line)
      ).toBeInTheDocument();
    });

    it('puts the goal line on no other card', () => {
      expect(screen.getAllByTestId(GOAL_PROGRESS_TEST_IDS.line)).toHaveLength(
        1
      );
    });

    it('locks the savings card', () => {
      const [savingsCard] = screen.getAllByTestId(WALLET_CARD_TEST_IDS.card);

      expect(
        within(savingsCard).getByTestId(WALLET_CARD_TEST_IDS.lock)
      ).toBeInTheDocument();
    });

    it('locks no other card', () => {
      expect(screen.getAllByTestId(WALLET_CARD_TEST_IDS.lock)).toHaveLength(1);
    });
  });
});
