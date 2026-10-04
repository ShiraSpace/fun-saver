import { render, screen } from '@/test-utils/render';
import { createMockSpendableWallet } from '@/test-utils/mocks/wallet.mocks';
import { WALLET_NAME } from '@/lib/wallet/constants';
import { ChildWallet } from './ChildWallet';
import { CHILD_WALLET_COPY, CHILD_WALLET_TEST_IDS } from './constants';

describe('ChildWallet', () => {
  describe('a spending wallet holding ₪23.99', () => {
    beforeEach(() => {
      render(
        <ChildWallet
          wallet={createMockSpendableWallet(WALLET_NAME.spending, {
            balance: 2399,
          })}
        />
      );
    });

    it('shows ₪23, never money the child does not have', () => {
      expect(
        screen.getByTestId(CHILD_WALLET_TEST_IDS.balance)
      ).toHaveTextContent('₪23');
    });

    it('tells the child this is the money to spend', () => {
      expect(screen.getByTestId(CHILD_WALLET_TEST_IDS.card)).toHaveTextContent(
        CHILD_WALLET_COPY.spending
      );
    });
  });

  describe('a good-deeds wallet', () => {
    beforeEach(() => {
      render(
        <ChildWallet
          wallet={createMockSpendableWallet(WALLET_NAME.goodDeeds)}
        />
      );
    });

    it('tells the child this is the money to give', () => {
      expect(screen.getByTestId(CHILD_WALLET_TEST_IDS.card)).toHaveTextContent(
        CHILD_WALLET_COPY.goodDeeds
      );
    });
  });
});
