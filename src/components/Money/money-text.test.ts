import { MONEY_ROUNDING } from './constants';
import { floorToTenthsText, shekelsText } from './money-text';

describe('an amount written to the tenth of a shekel', () => {
  it('drops what is below the tenth rather than rounding up', () => {
    expect(floorToTenthsText(9689)).toBe('96.8');
  });

  it('writes a whole amount without a decimal', () => {
    expect(floorToTenthsText(9600)).toBe('96');
  });

  it('keeps the agorot of an amount below a tenth, so it never reads 0', () => {
    expect(floorToTenthsText(4)).toBe('0.04');
  });

  it('writes nothing at all as 0', () => {
    expect(floorToTenthsText(0)).toBe('0');
  });

  it('drops a fall to the tenth below it too', () => {
    expect(floorToTenthsText(-9689)).toBe('-96.9');
  });
});

describe('an amount written to the agora', () => {
  it('keeps both decimals on a whole amount', () => {
    expect(shekelsText(9600, MONEY_ROUNDING.toTheAgora)).toBe('96.00');
  });
});
