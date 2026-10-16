import { floorToTenthsText } from './money-text';

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

  it('drops toward zero on a fall too', () => {
    expect(floorToTenthsText(-9689)).toBe('-96.8');
  });
});
