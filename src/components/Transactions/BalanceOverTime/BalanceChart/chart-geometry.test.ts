import { SHOWN_BALANCE } from '../../constants';
import {
  balanceLinePath,
  balanceTicks,
  balanceYWithin,
  dayXWithin,
  firstDayXOf,
  eachShownBalanceHistory,
  lowestAndHighestBalance,
  todaysBalancesSpacedApart,
  totalBalanceFillPath,
} from './chart-geometry';
import {
  UNMEASURED_CHART_WIDTH,
  FLAT_BALANCE_Y,
  HIGHEST_BALANCE_Y,
  LABEL_GAP,
  LOWEST_BALANCE_Y,
  TODAY_X,
} from './constants';

const mockFirstDayX = firstDayXOf(UNMEASURED_CHART_WIDTH);

describe('where the chart draws a balance', () => {
  describe('a balance that did not move across the range', () => {
    const mockBalance = 1800;
    const mockBalanceBounds = { lowest: mockBalance, highest: mockBalance };

    it('is drawn across the middle, not along the bottom where it reads as zero', () => {
      expect(balanceYWithin(mockBalanceBounds)(mockBalance)).toBe(
        FLAT_BALANCE_Y
      );
    });

    it('is labelled once, not three times', () => {
      expect(balanceTicks(mockBalanceBounds)).toEqual([mockBalance]);
    });
  });

  describe('a month of days', () => {
    it('ends on today at the edge a right-to-left reading ends on', () => {
      expect(dayXWithin(30, mockFirstDayX)(29)).toBe(TODAY_X);
    });

    it('starts on its first day at the far edge', () => {
      expect(dayXWithin(30, mockFirstDayX)(0)).toBe(mockFirstDayX);
    });
  });

  it('puts a history of one day at today', () => {
    expect(dayXWithin(1, mockFirstDayX)(0)).toBe(TODAY_X);
  });
});

describe('the balances labelled on the side', () => {
  it('reads in half shekels when whole shekels would print two the same', () => {
    expect(balanceTicks({ lowest: 2600, highest: 2700 })).toEqual([
      2600, 2650, 2700,
    ]);
  });

  it('marks a balance that barely moved only with amounts inside its range', () => {
    expect(balanceTicks({ lowest: 2630, highest: 2680 })).toEqual([2650]);
  });

  it('marks a balance that did not move in whole shekels', () => {
    expect(balanceTicks({ lowest: 1827, highest: 1827 })).toEqual([1800]);
  });

  it('stays in whole shekels when they already read apart', () => {
    expect(balanceTicks({ lowest: 2400, highest: 30100 })).toEqual([
      2400, 16300, 30100,
    ]);
  });
});

describe('the balances the chart shows', () => {
  const mockBalanceHistory = {
    days: ['2026-01-01', '2026-01-02'],
    totalBalance: [900, 1000],
    wallets: {
      savings: [500, 600],
      spending: [300, 300],
      goodDeeds: [100, 100],
    },
  };

  it('reads a wallet from its own history', () => {
    expect(
      eachShownBalanceHistory(mockBalanceHistory, [SHOWN_BALANCE.savings])
    ).toEqual([
      { shownBalance: SHOWN_BALANCE.savings, dailyBalances: [500, 600] },
    ]);
  });

  it('reads the total from the total balance', () => {
    expect(
      eachShownBalanceHistory(mockBalanceHistory, [SHOWN_BALANCE.totalBalance])
    ).toEqual([
      { shownBalance: SHOWN_BALANCE.totalBalance, dailyBalances: [900, 1000] },
    ]);
  });

  it('scales to the lowest and highest balance of every line, not just the first', () => {
    const shownBalanceHistories = [
      { shownBalance: SHOWN_BALANCE.totalBalance, dailyBalances: [900, 1000] },
      { shownBalance: SHOWN_BALANCE.goodDeeds, dailyBalances: [100, 100] },
    ];

    expect(lowestAndHighestBalance(shownBalanceHistories)).toEqual({
      lowest: 100,
      highest: 1000,
    });
  });
});

describe('the line of a balance', () => {
  const mockBalanceY = balanceYWithin({ lowest: 0, highest: 100 });

  it('draws one day as a single point, with nothing to join', () => {
    expect(
      balanceLinePath([50], dayXWithin(1, mockFirstDayX), mockBalanceY)
    ).not.toContain('L');
  });
});

describe('the fill under the total balance', () => {
  const mockBalanceY = balanceYWithin({ lowest: 0, highest: 100 });
  const mockDayX = dayXWithin(2, mockFirstDayX);

  it('closes along the bottom of the chart', () => {
    const totalBalanceFill = totalBalanceFillPath(
      [{ shownBalance: SHOWN_BALANCE.totalBalance, dailyBalances: [40, 100] }],
      mockDayX,
      mockBalanceY
    );

    expect(totalBalanceFill).toMatch(
      new RegExp(
        `L ${TODAY_X} ${LOWEST_BALANCE_Y} L ${mockFirstDayX} ${LOWEST_BALANCE_Y} Z$`
      )
    );
  });

  it('is left out for a total of one day, which has no line to fill under', () => {
    expect(
      totalBalanceFillPath(
        [{ shownBalance: SHOWN_BALANCE.totalBalance, dailyBalances: [100] }],
        mockDayX,
        mockBalanceY
      )
    ).toBeUndefined();
  });

  it('is left out when the total is not shown', () => {
    expect(
      totalBalanceFillPath(
        [{ shownBalance: SHOWN_BALANCE.savings, dailyBalances: [40, 100] }],
        mockDayX,
        mockBalanceY
      )
    ).toBeUndefined();
  });
});

describe('today’s balance at the end of each line', () => {
  it('pushes two labels that would overlap apart', () => {
    const [upper, lower] = todaysBalancesSpacedApart([
      { shownBalance: SHOWN_BALANCE.totalBalance, todaysBalance: 100, y: 50 },
      { shownBalance: SHOWN_BALANCE.savings, todaysBalance: 100, y: 50 },
    ]);

    expect(lower.y - upper.y).toBe(LABEL_GAP);
  });

  it('keeps the labels inside the chart when they would run off the bottom', () => {
    const spacedApart = todaysBalancesSpacedApart([
      {
        shownBalance: SHOWN_BALANCE.savings,
        todaysBalance: 0,
        y: LOWEST_BALANCE_Y,
      },
      {
        shownBalance: SHOWN_BALANCE.spending,
        todaysBalance: 0,
        y: LOWEST_BALANCE_Y,
      },
      {
        shownBalance: SHOWN_BALANCE.goodDeeds,
        todaysBalance: 0,
        y: LOWEST_BALANCE_Y,
      },
    ]);

    expect(Math.max(...spacedApart.map(({ y }) => y))).toBe(LOWEST_BALANCE_Y);
  });

  it('keeps a label below the top of the chart', () => {
    const [label] = todaysBalancesSpacedApart([
      { shownBalance: SHOWN_BALANCE.savings, todaysBalance: 0, y: 0 },
    ]);

    expect(label.y).toBe(HIGHEST_BALANCE_Y);
  });
});
