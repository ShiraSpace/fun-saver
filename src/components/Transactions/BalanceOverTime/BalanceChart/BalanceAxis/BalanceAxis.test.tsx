import { render, screen } from '@/test-utils/render';
import { agorotToShekels } from '@/lib/money';
import { MONEY_COPY } from '@/components/Money/constants';
import { balanceTicks, balanceYWithin, firstDayXOf } from '../chart-geometry';
import { UNMEASURED_CHART_WIDTH } from '../constants';
import { BALANCE_AXIS_TEST_IDS } from './constants';
import { BalanceAxis } from './BalanceAxis';

const mockBalanceBounds = { lowest: 2600, highest: 2700 };

describe('the balances along the side of the chart', () => {
  beforeEach(() => {
    render(
      <svg>
        <BalanceAxis
          balanceBounds={mockBalanceBounds}
          balanceY={balanceYWithin(mockBalanceBounds)}
          firstDayX={firstDayXOf(UNMEASURED_CHART_WIDTH)}
        />
      </svg>
    );
  });

  it('prints each balance in shekels, half shekels included', () => {
    const tickTexts = balanceTicks(mockBalanceBounds).map(
      (balance) => `${MONEY_COPY.currencySign}${agorotToShekels(balance)}`
    );

    expect(
      screen
        .getAllByTestId(BALANCE_AXIS_TEST_IDS.tick)
        .map((tick) => tick.textContent)
    ).toEqual(tickTexts);
  });
});
