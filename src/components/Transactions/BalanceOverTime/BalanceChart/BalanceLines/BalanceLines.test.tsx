import { render, screen } from '@/test-utils/render';
import { SHOWN_BALANCE } from '../../../constants';
import { balanceYWithin, dayXWithin, firstDayXOf } from '../chart-geometry';
import type { ShownBalanceHistory } from '../chart-geometry';
import { UNMEASURED_CHART_WIDTH } from '../constants';
import { BALANCE_LINE_TEST_IDS } from './BalanceLine/constants';
import { BALANCE_LINES_TEST_IDS } from './constants';
import { BalanceLines } from './BalanceLines';

const mockTotalBalanceOverThreeDays: ShownBalanceHistory = {
  shownBalance: SHOWN_BALANCE.totalBalance,
  dailyBalances: [900, 950, 1000],
};

const mockSavingsOverThreeDays: ShownBalanceHistory = {
  shownBalance: SHOWN_BALANCE.savings,
  dailyBalances: [500, 550, 600],
};

function renderInSvg(shownBalanceHistories: ShownBalanceHistory[]): void {
  const dayCount = shownBalanceHistories[0].dailyBalances.length;

  render(
    <svg>
      <BalanceLines
        shownBalanceHistories={shownBalanceHistories}
        dayX={dayXWithin(dayCount, firstDayXOf(UNMEASURED_CHART_WIDTH))}
        balanceY={balanceYWithin({ lowest: 0, highest: 1000 })}
      />
    </svg>
  );
}

describe('the lines of the shown balances', () => {
  describe('with the total and savings shown over several days', () => {
    beforeEach(() => {
      renderInSvg([mockTotalBalanceOverThreeDays, mockSavingsOverThreeDays]);
    });

    it('fills the area under the total', () => {
      expect(
        screen.getByTestId(BALANCE_LINES_TEST_IDS.totalBalanceFill)
      ).toBeInTheDocument();
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

  describe('with only a wallet shown', () => {
    beforeEach(() => {
      renderInSvg([mockSavingsOverThreeDays]);
    });

    it('fills nothing, since the fill belongs to the total', () => {
      expect(
        screen.queryByTestId(BALANCE_LINES_TEST_IDS.totalBalanceFill)
      ).not.toBeInTheDocument();
    });
  });

  describe('with the total of a one-day account', () => {
    beforeEach(() => {
      renderInSvg([
        { shownBalance: SHOWN_BALANCE.totalBalance, dailyBalances: [1000] },
      ]);
    });

    it('fills nothing under a single dot', () => {
      expect(
        screen.queryByTestId(BALANCE_LINES_TEST_IDS.totalBalanceFill)
      ).not.toBeInTheDocument();
    });
  });
});
