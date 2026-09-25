import { render, screen } from '@/test-utils/render';
import { createMockTransaction } from '@/test-utils/mocks/transaction.mocks';
import { mockAccountSummary } from '@/test-utils/mocks/account.mocks';
import {
  balanceHistory,
  totalBalanceChange,
} from '@/lib/wallet/balance-history';
import { balanceChangeInShekels } from '@/lib/money';
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
        shownBalances: ['totalBalance'],
        toggleShownBalance: jest.fn(),
        allWalletsShown: false,
        toggleAllWallets: jest.fn(),
      }}
    />
  );
}

function balanceChangeOver(rangeId: RangeId): string {
  return String(
    balanceChangeInShekels(
      totalBalanceChange(mockBalanceHistory, RANGE[rangeId].days)
    )
  );
}

describe('the balance over time', () => {
  describe('over the week', () => {
    beforeEach(() => {
      renderBalanceOverTime('week');
    });

    it('shows how much the total balance moved that week', () => {
      expect(
        screen.getByTestId(TOTAL_BALANCE_TEST_IDS.balanceChange)
      ).toHaveTextContent(balanceChangeOver('week'));
    });

    it('names the week as the range it measured', () => {
      expect(
        screen.getByTestId(TOTAL_BALANCE_TEST_IDS.changeOverRange)
      ).toHaveTextContent(RANGE.week.changeLabel);
    });
  });

  describe('since the start', () => {
    beforeEach(() => {
      renderBalanceOverTime('all');
    });

    it('shows how much the total balance moved since the first transaction', () => {
      expect(
        screen.getByTestId(TOTAL_BALANCE_TEST_IDS.balanceChange)
      ).toHaveTextContent(balanceChangeOver('all'));
    });
  });
});
