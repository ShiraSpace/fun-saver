import { splitDeposit } from '../transactions';
import { DEPOSIT_SPLIT } from '../constants';

describe('splitDeposit', () => {
  it('gives each pot its configured share of the deposit', () => {
    const total = 2000;
    const split = splitDeposit(total);

    expect(split.spending).toBe(Math.floor(total * DEPOSIT_SPLIT.spending));
    expect(split.goodDeeds).toBe(Math.floor(total * DEPOSIT_SPLIT.goodDeeds));
    expect(split.savings).toBe(total - split.spending - split.goodDeeds);
  });

  it('gives the rounding remainder to savings so the parts sum to the total', () => {
    const total = 333;
    const split = splitDeposit(total);

    expect(split.savings + split.spending + split.goodDeeds).toBe(total);
    expect(split.savings).toBe(total - split.spending - split.goodDeeds);
  });

  it('keeps the sum exact for a large, awkward amount', () => {
    const total = 123457;
    const split = splitDeposit(total);

    expect(split.savings + split.spending + split.goodDeeds).toBe(total);
  });
});

describe('DEPOSIT_SPLIT config', () => {
  it('is the single source of truth for the deposit ratios', () => {
    expect(DEPOSIT_SPLIT).toEqual({
      savings: 0.4,
      spending: 0.5,
      goodDeeds: 0.1,
    });

    const total = Object.values(DEPOSIT_SPLIT).reduce((sum, r) => sum + r, 0);
    expect(total).toBeCloseTo(1);
  });
});
