import { dailyRate } from './daily-rate';

export function interestForDay(
  closingBalanceAgorot: number,
  monthlyRate: number
): number {
  if (closingBalanceAgorot <= 0) {
    return 0;
  }

  return Math.round(closingBalanceAgorot * dailyRate(monthlyRate));
}
