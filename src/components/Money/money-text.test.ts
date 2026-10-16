import { MONEY_ROUNDING } from './constants';
import { shekelsText } from './money-text';

describe('an amount written to the tenth of a shekel', () => {
  it('drops what is below the tenth rather than rounding up', () => {
    expect(shekelsText(9689, MONEY_ROUNDING.floorToTenths)).toBe('96.8');
  });

  it('writes a whole amount without a decimal', () => {
    expect(shekelsText(9600, MONEY_ROUNDING.floorToTenths)).toBe('96');
  });

  it('keeps the agorot of an amount below a tenth, so it never reads 0', () => {
    expect(shekelsText(4, MONEY_ROUNDING.floorToTenths)).toBe('0.04');
  });

  it('writes nothing at all as 0', () => {
    expect(shekelsText(0, MONEY_ROUNDING.floorToTenths)).toBe('0');
  });

  it('drops a fall to the tenth below it too', () => {
    expect(shekelsText(-9689, MONEY_ROUNDING.floorToTenths)).toBe('-96.9');
  });
});

describe('an amount written to the agora', () => {
  it('keeps both decimals on a whole amount', () => {
    expect(shekelsText(9600, MONEY_ROUNDING.exact)).toBe('96.00');
  });
});
