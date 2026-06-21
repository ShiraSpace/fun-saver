import {
  balance,
  interestGain,
  principal,
  todayInterest,
} from '../derivations';
import type { Transaction } from '../types';

const tx = (
  type: Transaction['type'],
  amount: number,
  occurredAt: string
): Transaction => ({
  id: `${type}-${occurredAt}-${amount}`,
  walletId: 'w1',
  type,
  amount,
  occurredAt,
});

describe('derivations', () => {
  const txns: Transaction[] = [
    tx('deposit', 8000, '2026-01-01'),
    tx('interest', 53, '2026-01-02'),
    tx('withdrawal', 1000, '2026-01-03'),
    tx('interest', 47, '2026-01-03'),
  ];

  it('balance = deposits - withdrawals + interest', () => {
    expect(balance(txns)).toBe(8000 - 1000 + 53 + 47);
  });

  it('principal = deposits - withdrawals', () => {
    expect(principal(txns)).toBe(7000);
  });

  it('interestGain = sum of interest', () => {
    expect(interestGain(txns)).toBe(100);
  });

  it('todayInterest = interest dated asOf only', () => {
    expect(todayInterest(txns, '2026-01-03')).toBe(47);
    expect(todayInterest(txns, '2026-01-10')).toBe(0);
  });
});
