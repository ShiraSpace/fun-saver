import { render, screen } from '@/test-utils/render';
import { getThemeTokens, THEME_ID } from '@/theme/registry';
import { SHOWN_BALANCE } from '../../../../constants';
import { WALLET_CHART_COLOR } from '../../../constants';
import { balanceYWithin, dayXWithin, firstDayXOf } from '../../chart-geometry';
import { UNMEASURED_CHART_WIDTH } from '../../constants';
import { BALANCE_LINE_TEST_IDS } from './constants';
import { BalanceLine } from './BalanceLine';

const mockBalanceY = balanceYWithin({ lowest: 0, highest: 1000 });

function renderInSvg(dailyBalances: number[]): void {
  render(
    <svg>
      <BalanceLine
        shownBalanceHistory={{
          shownBalance: SHOWN_BALANCE.spending,
          dailyBalances,
        }}
        dayX={dayXWithin(
          dailyBalances.length,
          firstDayXOf(UNMEASURED_CHART_WIDTH)
        )}
        balanceY={mockBalanceY}
      />
    </svg>,
    { themeId: THEME_ID.jungleQuest }
  );
}

describe('the line of one balance', () => {
  describe('over several days', () => {
    beforeEach(() => {
      renderInSvg([200, 600, 1000]);
    });

    it('is drawn in its wallet’s chart colour', () => {
      expect(
        screen.getByTestId(BALANCE_LINE_TEST_IDS.line(SHOWN_BALANCE.spending))
      ).toHaveAttribute(
        'stroke',
        getThemeTokens(THEME_ID.jungleQuest).colors[WALLET_CHART_COLOR.spending]
      );
    });
  });

  describe('over a single day', () => {
    beforeEach(() => {
      renderInSvg([600]);
    });

    it('is drawn as a dot, since one day has no line to join', () => {
      expect(
        screen.getByTestId(BALANCE_LINE_TEST_IDS.line(SHOWN_BALANCE.spending))
          .tagName
      ).toBe('circle');
    });
  });
});
