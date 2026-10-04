import { render, screen } from '@/test-utils/render';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { ChildSavings } from './ChildSavings';
import { CHILD_SAVINGS_TEST_IDS } from './constants';

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
      expect(
        screen.getByTestId(CHILD_SAVINGS_TEST_IDS.balance)
      ).toHaveTextContent('₪148');
    });

    it('shows what the child put in', () => {
      expect(
        screen.getByTestId(CHILD_SAVINGS_TEST_IDS.principal)
      ).toHaveTextContent('₪142');
    });

    it('shows what the money earned by itself', () => {
      expect(
        screen.getByTestId(CHILD_SAVINGS_TEST_IDS.interestEarned)
      ).toHaveTextContent('₪6');
    });
  });
});
