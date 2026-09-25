import {
  agorotToShekels,
  balanceChangeInShekels,
  agorotToWholeShekels,
  nearestHalfShekel,
  shekelsToAgorot,
} from '../money';

describe('agorotToShekels', () => {
  it('converts agorot to shekels', () => {
    expect(agorotToShekels(8500)).toBe(85);
    expect(agorotToShekels(540)).toBe(5.4);
  });
});

describe('agorotToWholeShekels', () => {
  it('rounds to the nearest whole shekel', () => {
    expect(agorotToWholeShekels(26484)).toBe(265);
    expect(agorotToWholeShekels(8500)).toBe(85);
  });
});

describe('shekelsToAgorot', () => {
  it('converts shekels to agorot', () => {
    expect(shekelsToAgorot(85)).toBe(8500);
    expect(shekelsToAgorot(20)).toBe(2000);
  });
});

describe('nearestHalfShekel', () => {
  it('rounds to a whole shekel', () => {
    expect(nearestHalfShekel(102)).toBe(1);
  });

  it('rounds to a half shekel', () => {
    expect(nearestHalfShekel(140)).toBe(1.5);
  });

  it('rounds up to half a shekel', () => {
    expect(nearestHalfShekel(38)).toBe(0.5);
  });

  it('rounds an exact midpoint down', () => {
    expect(nearestHalfShekel(525)).toBe(5);
  });

  it('rounds up to two and a half shekels', () => {
    expect(nearestHalfShekel(238)).toBe(2.5);
  });

  it('returns null when the amount rounds to zero', () => {
    expect(nearestHalfShekel(0)).toBeNull();
    expect(nearestHalfShekel(18)).toBeNull();
    expect(nearestHalfShekel(20)).toBeNull();
  });
});

describe('balanceChangeInShekels', () => {
  it('keeps a fall falling while rounding it to the nearest half shekel', () => {
    expect(balanceChangeInShekels(-140)).toBe(-1.5);
  });

  it('reads a change too small to show as no change, not as a fall', () => {
    expect(balanceChangeInShekels(-20)).toBe(0);
  });
});
