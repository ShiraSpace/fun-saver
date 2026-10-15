import { render, screen } from '@/test-utils/render';
import { MONEY_COPY } from '@/components/Money/constants';
import { SHOWN_BALANCE, type ShownBalance } from '../../../constants';
import { shownBalanceLabel } from '../../constants';
import { balanceYWithin } from '../chart-geometry';
import { SWATCH, TODAYS_BALANCE_LABEL_TEST_IDS } from './TodaysBalanceLabel/constants';
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
          todaysTotalBalance={1000}
          balanceY={balanceYWithin({ lowest: 500, highest: 1000 })}
        />
      </svg>
    );
  });

  it('labels every line shown', () => {
    expect(screen.getAllByTestId(TODAYS_BALANCE_LABEL_TEST_IDS.label)).toHaveLength(2);
  });
});

describe('today’s balances when the wallets hold agorot', () => {
  const mockTotalBalanceLineEnd = 10719;
  const mockBalanceY = balanceYWithin({ lowest: 4600, highest: mockTotalBalanceLineEnd });

  function labelOf(shownBalance: ShownBalance): HTMLElement | undefined {
    return screen
      .getAllByTestId(TODAYS_BALANCE_LABEL_TEST_IDS.label)
      .find((label) => label.textContent?.startsWith(shownBalanceLabel(shownBalance)));
  }

  beforeEach(() => {
    render(
      <svg>
        <TodaysBalances
          shownBalanceHistories={[
            {
              shownBalance: SHOWN_BALANCE.totalBalance,
              dailyBalances: [10000, mockTotalBalanceLineEnd],
            },
            { shownBalance: SHOWN_BALANCE.savings, dailyBalances: [4600, 4669] },
          ]}
          todaysTotalBalance={10600}
          balanceY={mockBalanceY}
        />
      </svg>
    );
  });

  it('labels the total with today’s total balance, not where its line ends', () => {
    expect(labelOf(SHOWN_BALANCE.totalBalance)).toHaveTextContent(
      new RegExp(`${MONEY_COPY.currencySign}106$`)
    );
  });

  it('places the total’s label where its line ends', () => {
    expect(labelOf(SHOWN_BALANCE.totalBalance)?.querySelector('rect')).toHaveAttribute(
      'y',
      String(mockBalanceY(mockTotalBalanceLineEnd) - SWATCH.size / 2)
    );
  });

  it('labels a wallet with where its line ends', () => {
    expect(labelOf(SHOWN_BALANCE.savings)).toHaveTextContent(
      new RegExp(`${MONEY_COPY.currencySign}46$`)
    );
  });
});
