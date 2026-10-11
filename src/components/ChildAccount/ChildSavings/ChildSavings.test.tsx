import { render, screen } from '@/test-utils/render';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { createMockGoal, createMockSavedTowardGoal } from '@/test-utils/mocks/goal.mocks';
import {
  COINS_IN_A_FULL_PILE,
  COINS_IN_HALF_A_PILE,
  coinsDrawnInPile,
} from '@/test-utils/coin-pile';
import { ChildSavings } from './ChildSavings';
import { CHILD_SAVINGS_COPY, CHILD_SAVINGS_TEST_IDS } from './constants';
import { PRINCIPAL_AND_INTEREST_TEST_IDS } from './PrincipalAndInterest/constants';

describe('ChildSavings', () => {
  describe('savings of ₪148.90, ₪6.40 of it interest', () => {
    beforeEach(() => {
      render(
        <ChildSavings
          savings={createMockWalletSummary({
            balance: 14890,
            interestEarned: 640,
          })}
        />
      );
    });

    it('shows the savings without agorot, never rounded up', () => {
      expect(screen.getByTestId(CHILD_SAVINGS_TEST_IDS.balance)).toHaveTextContent('₪148');
    });

    it('shows what the child put in: the savings less the interest', () => {
      expect(screen.getByTestId(PRINCIPAL_AND_INTEREST_TEST_IDS.principal)).toHaveTextContent(
        '₪142'
      );
    });

    it('shows what the money earned by itself, in whole shekels', () => {
      expect(screen.getByTestId(PRINCIPAL_AND_INTEREST_TEST_IDS.interestEarned)).toHaveTextContent(
        '₪6'
      );
    });
  });

  describe('₪150 saved, with no goal', () => {
    beforeEach(() => {
      render(<ChildSavings savings={createMockWalletSummary({ balance: 15000 })} />);
    });

    it('fills the piggy bank halfway to ₪300', () => {
      expect(coinsDrawnInPile()).toBe(COINS_IN_HALF_A_PILE);
    });

    it('is named «החיסכון שלך» for screen readers', () => {
      expect(screen.getByRole('region', { name: CHILD_SAVINGS_COPY.title })).toBeInTheDocument();
    });
  });

  describe('₪50 saved toward a ₪100 goal', () => {
    beforeEach(() => {
      const mockSavedTowardGoal = createMockSavedTowardGoal({
        goal: createMockGoal({ amount: 10000 }),
        saved: 5000,
        stillToSave: 5000,
      });

      render(
        <ChildSavings
          savings={createMockWalletSummary({ balance: 5000 })}
          savedTowardGoal={mockSavedTowardGoal}
        />
      );
    });

    it('fills the piggy bank halfway to the goal', () => {
      expect(coinsDrawnInPile()).toBe(COINS_IN_HALF_A_PILE);
    });
  });

  describe('a goal reached while the card shows less than its amount', () => {
    beforeEach(() => {
      const mockSavedTowardGoal = createMockSavedTowardGoal({
        goal: createMockGoal({ amount: 10000 }),
        reached: true,
      });

      render(
        <ChildSavings
          savings={createMockWalletSummary({ balance: 5000 })}
          savedTowardGoal={mockSavedTowardGoal}
        />
      );
    });

    it('draws the piggy bank full', () => {
      expect(coinsDrawnInPile()).toBe(COINS_IN_A_FULL_PILE);
    });
  });
});
