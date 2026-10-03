import { render, screen } from '@/test-utils/render';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import { ChildWallet } from './ChildWallet';
import { CHILD_WALLET_COPY, CHILD_WALLET_TEST_IDS } from './constants';

describe('ChildWallet', () => {
  describe('a spending wallet holding ₪23.99', () => {
    beforeEach(() => {
      render(
        <ChildWallet
          wallet={{
            ...createMockWalletSummary({ name: 'spending', balance: 2399 }),
            name: 'spending',
          }}
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
});
