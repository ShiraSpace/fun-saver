import { DAYS_PER_MONTH } from '../constants';

export function dailyRate(monthlyRate: number): number {
  return monthlyRate / DAYS_PER_MONTH;
}
