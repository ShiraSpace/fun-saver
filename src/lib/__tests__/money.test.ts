import {
  agorotToShekels,
  agorotToWholeShekels,
  coinBreakdown,
  halfShekelAmount,
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

describe('halfShekelAmount', () => {
  it('rounds to a whole shekel', () => {
    expect(halfShekelAmount(102)).toBe(1);
  });

  it('rounds to a half shekel', () => {
    expect(halfShekelAmount(140)).toBe(1.5);
  });

  it('rounds up to half a shekel', () => {
    expect(halfShekelAmount(38)).toBe(0.5);
  });

  it('rounds up to two and a half shekels', () => {
    expect(halfShekelAmount(238)).toBe(2.5);
  });

  it('returns null when the amount rounds to zero', () => {
    expect(halfShekelAmount(0)).toBeNull();
    expect(halfShekelAmount(18)).toBeNull();
    expect(halfShekelAmount(20)).toBeNull();
  });
});

describe('coinBreakdown', () => {
  it('splits an exact half-shekel into full coins and a half', () => {
    expect(coinBreakdown(550)).toEqual({ show: true, full: 5, half: true });
  });

  it('splits a whole-shekel amount into full coins only', () => {
    expect(coinBreakdown(500)).toEqual({ show: true, full: 5, half: false });
  });

  it('rounds down to the nearest half-shekel', () => {
    expect(coinBreakdown(525)).toEqual({ show: true, full: 5, half: false });
  });

  it('rounds up to the nearest half-shekel', () => {
    expect(coinBreakdown(540)).toEqual({ show: true, full: 5, half: true });
  });

  it('hides when the amount rounds to zero', () => {
    expect(coinBreakdown(0)).toEqual({ show: false, full: 0, half: false });
    expect(coinBreakdown(20)).toEqual({ show: false, full: 0, half: false });
  });
});
