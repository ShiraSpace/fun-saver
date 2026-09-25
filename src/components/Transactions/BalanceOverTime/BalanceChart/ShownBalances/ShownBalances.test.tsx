import { render, screen } from '@/test-utils/render';
import type { BalanceHistory } from '@/lib/wallet/balance-history';
import { SHOWN_BALANCE } from '../../../constants';
import { BALANCE_LINE_TEST_IDS } from '../BalanceLines/BalanceLine/constants';
import { TODAYS_BALANCE_LABEL_TEST_IDS } from '../TodaysBalances/TodaysBalanceLabel/constants';
import { UNMEASURED_CHART_WIDTH } from '../constants';
import { ShownBalances } from './ShownBalances';

const mockBalanceHistory: BalanceHistory = {
  days: ['2026-01-01', '2026-01-02', '2026-01-03'],
  totalBalance: [900, 950, 1000],
  wallets: {
    savings: [500, 550, 600],
    spending: [300, 300, 300],
    goodDeeds: [100, 100, 100],
  },
};

describe('the shown balances', () => {
  describe('with only savings chosen', () => {
    beforeEach(() => {
      render(
        <svg>
          <ShownBalances
            balanceHistory={mockBalanceHistory}
            shownBalances={[SHOWN_BALANCE.savings]}
            chartWidth={UNMEASURED_CHART_WIDTH}
          />
        </svg>
      );
    });

    it('draws the savings line', () => {
      expect(
        screen.getByTestId(BALANCE_LINE_TEST_IDS.line(SHOWN_BALANCE.savings))
      ).toBeInTheDocument();
    });

    it('leaves out the total, which was not chosen', () => {
      expect(
        screen.queryByTestId(
          BALANCE_LINE_TEST_IDS.line(SHOWN_BALANCE.totalBalance)
        )
      ).not.toBeInTheDocument();
    });

    it('labels today’s balance of the savings line alone', () => {
      expect(
        screen.getAllByTestId(TODAYS_BALANCE_LABEL_TEST_IDS.label)
      ).toHaveLength(1);
    });
  });
});
