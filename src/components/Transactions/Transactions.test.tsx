import { fireEvent, render, screen } from '@/test-utils/render';
import { createMockTransaction } from '@/test-utils/mocks/transaction.mocks';
import {
  mockAccountSummary,
  mockSiblingAccountSummary,
  mockUser,
} from '@/test-utils/mocks/general.mocks';
import {
  balanceHistory,
  todaysTotalBalance,
} from '@/lib/wallet/balance-history';
import { agorotToWholeShekels } from '@/lib/money';
import { HEADER_TITLE_TEST_IDS } from '@/components/Header/HeaderTitle/constants';
import { MENU_TEST_IDS } from '@/components/Menu/constants';
import { ACCOUNT_LIST_TEST_IDS } from '@/components/Menu/AccountList/constants';
import { openAccountPicker } from '@/test-utils/account-picker';
import { CHOICE_CHIPS_TEST_IDS } from './ChoiceChips/constants';
import { BALANCE_OVER_TIME_TEST_IDS } from './BalanceOverTime/constants';
import { TOTAL_BALANCE_TEST_IDS } from './BalanceOverTime/TotalBalance/constants';
import { TRANSACTIONS_COPY, TRANSACTIONS_ROUTE } from './constants';
import { Transactions } from './Transactions';

const mockAsOf = '2026-01-10';

const mockDeposits = [
  createMockTransaction(),
  createMockTransaction({
    id: 't2',
    amount: 2000,
    occurredAt: '2026-01-08',
    createdAt: '2026-01-08T10:00:00.000Z',
  }),
];

function rangeOption(rangeId: string): HTMLElement {
  return screen.getByTestId(
    CHOICE_CHIPS_TEST_IDS.option(BALANCE_OVER_TIME_TEST_IDS.ranges, rangeId)
  );
}

describe('the transactions screen', () => {
  beforeEach(() => {
    render(
      <Transactions
        accounts={[mockAccountSummary, mockSiblingAccountSummary]}
        initialAccount={mockAccountSummary}
        transactionsByAccount={{ [mockAccountSummary.id]: mockDeposits }}
        asOf={mockAsOf}
      />,
      { route: TRANSACTIONS_ROUTE, user: mockUser }
    );
  });

  it('names itself in the header, so the parent knows what they opened', () => {
    expect(screen.getByTestId(HEADER_TITLE_TEST_IDS.title)).toHaveTextContent(
      TRANSACTIONS_COPY.title
    );
  });

  it('opens on the month', () => {
    expect(rangeOption('month')).toBeChecked();
  });

  describe('when the parent picks the week', () => {
    beforeEach(() => {
      fireEvent.click(rangeOption('week'));
    });

    it('still shows today’s total balance', () => {
      const todaysTotal = todaysTotalBalance(
        balanceHistory({
          wallets: mockAccountSummary.wallets,
          transactions: mockDeposits,
          asOf: mockAsOf,
        })
      );

      expect(
        screen.getByTestId(TOTAL_BALANCE_TEST_IDS.totalBalance)
      ).toHaveTextContent(String(agorotToWholeShekels(todaysTotal)));
    });

    describe('and then switches to another child', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
        openAccountPicker();
        fireEvent.click(screen.getAllByTestId(ACCOUNT_LIST_TEST_IDS.row)[1]);
      });

      it('keeps the week picked', () => {
        expect(rangeOption('week')).toBeChecked();
      });
    });
  });
});
