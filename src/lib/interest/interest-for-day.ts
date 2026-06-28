import { dailyRate } from './daily-rate';

export function interestForDay(
  balanceAgorot: number,
  monthlyRate: number
): number {
  if (balanceAgorot <= 0) {
    return 0;
  }

  return Math.round(balanceAgorot * dailyRate(monthlyRate));
}
