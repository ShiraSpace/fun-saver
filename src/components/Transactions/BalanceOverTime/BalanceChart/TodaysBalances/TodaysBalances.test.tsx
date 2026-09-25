import { render, screen } from '@/test-utils/render';
import { SHOWN_BALANCE } from '../../../constants';
import { balanceYWithin } from '../chart-geometry';
import { TODAYS_BALANCE_LABEL_TEST_IDS } from './TodaysBalanceLabel/constants';
import { TodaysBalances } from './TodaysBalances';

describe('today’s balances at the end of the lines', () => {
  beforeEach(() => {
    render(
      <svg>
        <TodaysBalances
          shownBalanceHistories={[
            {
              shownBalance: SHOWN_BALANCE.totalBalance,
              dailyBalances: [900, 1000],
            },
            { shownBalance: SHOWN_BALANCE.savings, dailyBalances: [500, 600] },
          ]}
          balanceY={balanceYWithin({ lowest: 500, highest: 1000 })}
        />
      </svg>
    );
  });

  it('labels every line shown', () => {
    expect(
      screen.getAllByTestId(TODAYS_BALANCE_LABEL_TEST_IDS.label)
    ).toHaveLength(2);
  });
});
