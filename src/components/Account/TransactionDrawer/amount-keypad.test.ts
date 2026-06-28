import { pushDigit, popDigit } from './amount-keypad';

describe('amount-keypad', () => {
  it('appends a digit to the right', () => {
    expect(pushDigit(5, 3)).toBe(53);
  });

  it('treats zero as an empty start', () => {
    expect(pushDigit(0, 7)).toBe(7);
  });

  it('removes the last digit', () => {
    expect(popDigit(53)).toBe(5);
  });

  it('bottoms out at zero', () => {
    expect(popDigit(5)).toBe(0);
    expect(popDigit(0)).toBe(0);
  });
});
