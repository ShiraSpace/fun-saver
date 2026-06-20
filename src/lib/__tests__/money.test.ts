import { agorotToShekels, coinBreakdown } from '../money';

describe('agorotToShekels', () => {
  it('converts agorot to shekels', () => {
    expect(agorotToShekels(8500)).toBe(85);
    expect(agorotToShekels(540)).toBe(5.4);
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
