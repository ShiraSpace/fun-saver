import { render, screen } from '@/test-utils/render';
import type { BalanceHistory } from '@/lib/wallet/balance-history';
import { SHOWN_BALANCE } from '../../constants';
import { RANGE, shownBalanceLabel } from '../constants';
import { BALANCE_LINE_TEST_IDS } from './BalanceLines/BalanceLine/constants';
import { BALANCE_CHART_COPY, BALANCE_CHART_TEST_IDS } from './constants';
import { BalanceChart } from './BalanceChart';

const mockBalanceHistory: BalanceHistory = {
  days: ['2026-01-01', '2026-01-02', '2026-01-03'],
  totalBalance: [900, 950, 1000],
  wallets: {
    savings: [500, 550, 600],
    spending: [300, 300, 300],
    goodDeeds: [100, 100, 100],
  },
};

const mockNoTransactions: BalanceHistory = {
  days: [],
  totalBalance: [],
  wallets: { savings: [], spending: [], goodDeeds: [] },
};

describe('the balance chart', () => {
  describe('with every line turned off', () => {
    beforeEach(() => {
      render(
        <BalanceChart
          balanceHistory={mockBalanceHistory}
          shownBalances={[]}
          range={RANGE.month}
        />
      );
    });

    it('asks for at least one line rather than drawing an empty frame', () => {
      expect(
        screen.getByTestId(BALANCE_CHART_TEST_IDS.message)
      ).toHaveTextContent(BALANCE_CHART_COPY.noBalanceShown.text);
    });

    it('tells a screen reader that no line is chosen', () => {
      expect(
        screen.getByTestId(BALANCE_CHART_TEST_IDS.chart)
      ).toHaveAccessibleName(BALANCE_CHART_COPY.noBalanceShown.label);
    });
  });

  describe('for a child with no transactions yet, with lines chosen', () => {
    beforeEach(() => {
      render(
        <BalanceChart
          balanceHistory={mockNoTransactions}
          shownBalances={[SHOWN_BALANCE.totalBalance, SHOWN_BALANCE.savings]}
          range={RANGE.week}
        />
      );
    });

    it('says there is nothing yet rather than drawing an empty frame', () => {
      expect(
        screen.getByTestId(BALANCE_CHART_TEST_IDS.message)
      ).toHaveTextContent(BALANCE_CHART_COPY.noTransactions.text);
    });
  });

  describe('with the total and savings shown over the week', () => {
    beforeEach(() => {
      render(
        <BalanceChart
          balanceHistory={mockBalanceHistory}
          shownBalances={[SHOWN_BALANCE.totalBalance, SHOWN_BALANCE.savings]}
          range={RANGE.week}
        />
      );
    });

    it('tells a screen reader which range it is showing', () => {
      expect(
        screen
          .getByTestId(BALANCE_CHART_TEST_IDS.chart)
          .getAttribute('aria-label')
      ).toContain(RANGE.week.label);
    });

    it('tells a screen reader which lines it is showing', () => {
      expect(
        screen
          .getByTestId(BALANCE_CHART_TEST_IDS.chart)
          .getAttribute('aria-label')
      ).toContain(shownBalanceLabel(SHOWN_BALANCE.savings));
    });

    it('draws the total on top of the wallets', () => {
      const savingsLine = screen.getByTestId(
        BALANCE_LINE_TEST_IDS.line(SHOWN_BALANCE.savings)
      );
      const totalBalanceLine = screen.getByTestId(
        BALANCE_LINE_TEST_IDS.line(SHOWN_BALANCE.totalBalance)
      );

      expect(
        savingsLine.compareDocumentPosition(totalBalanceLine) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });
  });
});
