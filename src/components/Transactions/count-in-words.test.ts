import { countInWords } from './count-in-words';

describe('a count written in words', () => {
  const mockOne = 'יום אחד';

  function daysInWords(count: number): string {
    return countInWords(count, mockOne, (many) => `${many} ימים`);
  }

  it('names a single one in words instead of the digit', () => {
    expect(daysInWords(1)).toBe(mockOne);
  });

  it('writes a count of several with its number', () => {
    expect(daysInWords(3)).toBe('3 ימים');
  });

  it('writes a count of none with its number', () => {
    expect(daysInWords(0)).toBe('0 ימים');
  });
});
