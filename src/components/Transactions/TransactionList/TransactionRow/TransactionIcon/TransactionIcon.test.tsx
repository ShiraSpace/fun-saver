import { render, screen } from '@/test-utils/render';
import {
  createMockWithdrawal,
  mockWalletDeposits,
} from '@/test-utils/mocks/transaction.mocks';
import { createMockWallets } from '@/test-utils/mocks/wallet.mocks';
import { transactionListRowsFor } from '@/test-utils/transaction-rows';
import { INTEREST_MODE } from '@/lib/transaction/constants';
import { WALLET_ICON } from '@/lib/wallet/constants';
import { TRANSACTION_ROW_COPY } from '../constants';
import { TRANSACTION_ICON_TEST_IDS } from './constants';
import { TransactionIcon } from './TransactionIcon';

describe('a transaction icon', () => {
  const [mockDeposit] = mockWalletDeposits;

  function icon(): HTMLElement {
    return screen.getByTestId(TRANSACTION_ICON_TEST_IDS.icon);
  }

  describe('of a deposit', () => {
    const [mockDepositRow] = transactionListRowsFor(
      mockWalletDeposits,
      INTEREST_MODE.monthly,
      mockDeposit.occurredAt
    );

    beforeEach(() => {
      render(<TransactionIcon transactionListRow={mockDepositRow} />);
    });

    it('shows one deposit icon', () => {
      expect(icon()).toHaveTextContent(TRANSACTION_ROW_COPY.deposit.icon);
    });

    it('carries no badge, since a deposit has no one wallet', () => {
      expect(
        screen.queryByTestId(TRANSACTION_ICON_TEST_IDS.badge)
      ).not.toBeInTheDocument();
    });
  });

  describe('of a purchase', () => {
    const [, mockSpendingWallet] = createMockWallets();

    beforeEach(() => {
      const [mockPurchaseRow] = transactionListRowsFor(
        [createMockWithdrawal(mockSpendingWallet)],
        INTEREST_MODE.monthly,
        mockDeposit.occurredAt
      );
      render(<TransactionIcon transactionListRow={mockPurchaseRow} />);
    });

    it('shows the wallet the money came out of', () => {
      expect(icon()).toHaveTextContent(WALLET_ICON[mockSpendingWallet.name]);
    });

    it('badges it with what the money was for', () => {
      expect(
        screen.getByTestId(TRANSACTION_ICON_TEST_IDS.badge)
      ).toHaveTextContent(
        TRANSACTION_ROW_COPY.withdrawal[mockSpendingWallet.name].badge
      );
    });
  });
});
