import { render, screen } from '@/test-utils/render';
import { createMockTransaction } from '@/test-utils/mocks/transaction.mocks';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import { balanceHistory } from '@/lib/wallet/balance-history';
import { MONEY_COPY } from '@/components/Money/constants';
import { BALANCE_CHANGE_COPY } from '../BalanceChange/constants';
import { ALL_TRANSACTION_TYPES, INTEREST_MODE } from '@/lib/transaction/constants';
import { SHOWN_BALANCE } from '../constants';
import { TOTAL_BALANCE_TEST_IDS } from './TotalBalance/constants';
import { RANGE, type RangeId } from './constants';
import { BalanceOverTime } from './BalanceOverTime';

const mockBalanceHistory = balanceHistory({
  wallets: mockAccountSummary.wallets,
  transactions: [
    createMockTransaction(),
    createMockTransaction({ id: 't2', amount: 2000, occurredAt: '2026-01-08' }),
  ],
  asOf: '2026-01-10',
});

function renderBalanceOverTime(rangeId: RangeId): void {
  render(
    <BalanceOverTime
      balanceHistory={mockBalanceHistory}
      viewChoices={{
        range: rangeId,
        setRange: jest.fn(),
        shownBalances: [SHOWN_BALANCE.totalBalance],
        toggleShownBalance: jest.fn(),
        allWalletsShown: false,
        toggleAllWallets: jest.fn(),
        transactionTypeFilter: ALL_TRANSACTION_TYPES,
        setTransactionTypeFilter: jest.fn(),
        interestMode: INTEREST_MODE.byPeriod,
        setInterestMode: jest.fn(),
      }}
    />
  );
}

function shownRise(shekels: string): string {
  return `${BALANCE_CHANGE_COPY.rose}${MONEY_COPY.currencySign}${shekels}`;
}

function shownBalanceChange(): string | null {
  return screen.getByTestId(TOTAL_BALANCE_TEST_IDS.balanceChange).textContent;
}

describe('the balance over time', () => {
  describe('over the week', () => {
    beforeEach(() => {
      renderBalanceOverTime('week');
    });

    it('shows how much the total balance moved that week', () => {
      expect(shownBalanceChange()).toBe(shownRise('20'));
    });

    it('names the week as the range it measured', () => {
      expect(screen.getByTestId(TOTAL_BALANCE_TEST_IDS.changeOverRange)).toHaveTextContent(
        RANGE.week.changeLabel
      );
    });
  });

  describe('since the start', () => {
    beforeEach(() => {
      renderBalanceOverTime('all');
    });

    it('shows how much the total balance moved since the first transaction', () => {
      expect(shownBalanceChange()).toBe(shownRise('100'));
    });
  });
});
