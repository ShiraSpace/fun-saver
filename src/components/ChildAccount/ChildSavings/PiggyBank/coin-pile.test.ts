import { piggyBankFill } from './coin-pile';

describe('piggyBankFill', () => {
  const mockFullAt = 30000;

  it('is empty with no savings', () => {
    const empty = 0;

    expect(piggyBankFill({ savingsBalance: 0, fullAt: mockFullAt })).toBe(empty);
  });

  it('is half full at half of what it is full at', () => {
    const halfFull = 0.5;

    expect(piggyBankFill({ savingsBalance: mockFullAt / 2, fullAt: mockFullAt })).toBe(halfFull);
  });

  it('is full at what it is full at', () => {
    const full = 1;

    expect(piggyBankFill({ savingsBalance: mockFullAt, fullAt: mockFullAt })).toBe(full);
  });

  it('is never more than full', () => {
    const full = 1;

    expect(piggyBankFill({ savingsBalance: mockFullAt * 2, fullAt: mockFullAt })).toBe(full);
  });

  it('is full when it is full at nothing', () => {
    const full = 1;

    expect(piggyBankFill({ savingsBalance: 0, fullAt: 0 })).toBe(full);
  });
});
