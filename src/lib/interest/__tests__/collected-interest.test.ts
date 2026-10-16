import { shekelsToAgorot } from '@/lib/money';
import { createMockWalletSummary } from '@/test-utils/mocks/wallet.mocks';
import {
  collectInterest,
  interestCoinsOf,
  resolveCollectedInterest,
  savingsAtCollectedInterest,
  uncollectedInterestOf,
} from '../collected-interest';

describe('interestCoinsOf', () => {
  it('makes no coins below a shekel', () => {
    expect(interestCoinsOf(99)).toEqual([]);
  });

  it('splits ₪7 into ₪3, ₪2 and ₪2', () => {
    expect(interestCoinsOf(shekelsToAgorot(7))).toEqual([300, 200, 200]);
  });

  it('leaves the agorot off the coins', () => {
    expect(interestCoinsOf(shekelsToAgorot(2) + 50)).toEqual([100, 100]);
  });

  it('makes one coin of ₪1', () => {
    expect(interestCoinsOf(shekelsToAgorot(1))).toEqual([100]);
  });

  it('makes three coins of ₪1 from ₪3', () => {
    expect(interestCoinsOf(shekelsToAgorot(3))).toEqual([100, 100, 100]);
  });

  it('puts ₪100 on three coins of ₪34, ₪33 and ₪33', () => {
    expect(interestCoinsOf(shekelsToAgorot(100))).toEqual([3400, 3300, 3300]);
  });
});

describe('resolveCollectedInterest', () => {
  describe('with savings that have spent none of their interest', () => {
    const mockSavings = { balance: 10000, interestEarned: 1000 };

    it('starts from all the interest when there is no cookie', () => {
      expect(
        resolveCollectedInterest({ storedCollectedInterest: undefined, savings: mockSavings })
      ).toBe(1000);
    });

    it('starts from all the interest when the cookie is not written as whole agorot', () => {
      expect(
        resolveCollectedInterest({ storedCollectedInterest: '1e2', savings: mockSavings })
      ).toBe(1000);
    });

    it('starts from all the interest when the cookie is negative', () => {
      expect(
        resolveCollectedInterest({ storedCollectedInterest: '-5', savings: mockSavings })
      ).toBe(1000);
    });

    it('starts from all the interest when the cookie is above it', () => {
      expect(
        resolveCollectedInterest({ storedCollectedInterest: '2000', savings: mockSavings })
      ).toBe(1000);
    });

    it('keeps a valid cookie', () => {
      expect(
        resolveCollectedInterest({ storedCollectedInterest: '400', savings: mockSavings })
      ).toBe(400);
    });
  });

  describe('with savings withdrawn ₪5 below their interest', () => {
    const mockSavings = { balance: 500, interestEarned: 1000 };

    it('raises a cookie below the interest spent to it', () => {
      expect(
        resolveCollectedInterest({ storedCollectedInterest: '200', savings: mockSavings })
      ).toBe(500);
    });

    it('keeps a cookie above the interest spent', () => {
      expect(
        resolveCollectedInterest({ storedCollectedInterest: '700', savings: mockSavings })
      ).toBe(700);
    });
  });
});

describe('savingsAtCollectedInterest', () => {
  describe('with ₪6 of interest not yet collected', () => {
    const mockSavings = createMockWalletSummary({ balance: 10000, interestEarned: 1000 });
    const savingsAtTheMark = savingsAtCollectedInterest({
      savings: mockSavings,
      collectedInterest: 400,
    });

    it('takes it off the balance', () => {
      expect(savingsAtTheMark.balance).toBe(9400);
    });

    it('takes it off the interest earned', () => {
      expect(savingsAtTheMark.interestEarned).toBe(400);
    });

    it('is still the same wallet', () => {
      expect(savingsAtTheMark.name).toBe(mockSavings.name);
    });
  });

  it('never takes the balance below ₪0', () => {
    expect(
      savingsAtCollectedInterest({
        savings: { balance: 200, interestEarned: 1000 },
        collectedInterest: 0,
      }).balance
    ).toBe(0);
  });
});

describe('uncollectedInterestOf', () => {
  it('leaves the agorot to carry to a later coin', () => {
    expect(
      uncollectedInterestOf({
        savings: { balance: 11050, interestEarned: 1050 },
        collectedInterest: 0,
      })
    ).toBe(1000);
  });

  it('is never more than the balance after a withdrawal below the interest', () => {
    expect(
      uncollectedInterestOf({
        savings: { balance: 500, interestEarned: 1000 },
        collectedInterest: 0,
      })
    ).toBe(500);
  });

  describe('once the coins left after a withdrawal below the interest are collected', () => {
    const mockSavings = { balance: 500, interestEarned: 1000 };
    const mockVisitMark = resolveCollectedInterest({
      storedCollectedInterest: '0',
      savings: mockSavings,
    });
    const mockStoredCollectedInterest = String(
      collectInterest({
        storedCollectedInterest: '0',
        savings: mockSavings,
        collectedInterest:
          mockVisitMark +
          uncollectedInterestOf({ savings: mockSavings, collectedInterest: mockVisitMark }),
      })
    );

    function uncollectedOnTheNextVisit(savings: typeof mockSavings): number {
      const collectedInterest = resolveCollectedInterest({
        storedCollectedInterest: mockStoredCollectedInterest,
        savings,
      });

      return uncollectedInterestOf({ savings, collectedInterest });
    }

    it('shows none on the next visit', () => {
      expect(uncollectedOnTheNextVisit(mockSavings)).toBe(0);
    });

    it('never shows a later deposit as interest', () => {
      expect(uncollectedOnTheNextVisit({ balance: 1500, interestEarned: 1000 })).toBe(0);
    });
  });
});

describe('collectInterest', () => {
  const mockSavings = { balance: 10000, interestEarned: 1000 };

  it('saves the visit’s mark with the coin added', () => {
    expect(
      collectInterest({
        storedCollectedInterest: '400',
        savings: mockSavings,
        collectedInterest: 700,
      })
    ).toBe(700);
  });

  it('never saves more than the interest earned', () => {
    expect(
      collectInterest({
        storedCollectedInterest: '400',
        savings: mockSavings,
        collectedInterest: 1200,
      })
    ).toBe(1000);
  });

  it('keeps a larger mark another tab saved', () => {
    expect(
      collectInterest({
        storedCollectedInterest: '900',
        savings: mockSavings,
        collectedInterest: 700,
      })
    ).toBe(900);
  });

  it('counts a coin two tabs both collect once', () => {
    expect(
      collectInterest({
        storedCollectedInterest: '700',
        savings: mockSavings,
        collectedInterest: 700,
      })
    ).toBe(700);
  });
});
