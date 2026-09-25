import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { HALF_SHEKEL_AGOROT } from '@/lib/money';
import type { BalanceHistory } from '@/lib/wallet/balance-history';
import type { ShownBalance } from '../../use-transactions-view-choices';
import {
  BALANCE_TICK_COUNT,
  FIRST_DAY_X,
  FLAT_BALANCE_Y,
  HIGHEST_BALANCE_Y,
  LABEL_GAP,
  LOWEST_BALANCE_Y,
  TODAY_X,
} from './constants';

export interface ShownBalanceHistory {
  shownBalance: ShownBalance;
  dailyBalances: number[];
}

export interface BalanceBounds {
  lowest: number;
  highest: number;
}

export interface PlacedTodaysBalance {
  shownBalance: ShownBalance;
  todaysBalance: number;
  y: number;
}

export type BalanceY = (balance: number) => number;

function dailyBalancesOf(
  balanceHistory: BalanceHistory,
  shownBalance: ShownBalance
): number[] {
  return shownBalance === 'totalBalance'
    ? balanceHistory.totalBalance
    : balanceHistory.wallets[shownBalance];
}

export function eachShownBalanceHistory(
  balanceHistory: BalanceHistory,
  shownBalances: readonly ShownBalance[]
): ShownBalanceHistory[] {
  return shownBalances.map((shownBalance) => ({
    shownBalance,
    dailyBalances: dailyBalancesOf(balanceHistory, shownBalance),
  }));
}

export function lowestAndHighestBalance(
  shownBalanceHistories: ShownBalanceHistory[]
): BalanceBounds {
  const balances = shownBalanceHistories.flatMap(
    (shownBalanceHistory) => shownBalanceHistory.dailyBalances
  );

  return { lowest: Math.min(...balances), highest: Math.max(...balances) };
}

export function dayX(dayIndex: number, dayCount: number): number {
  const progress = dayCount > 1 ? dayIndex / (dayCount - 1) : 1;

  return FIRST_DAY_X + (TODAY_X - FIRST_DAY_X) * progress;
}

export function balanceYWithin({ lowest, highest }: BalanceBounds): BalanceY {
  const balanceSpan = highest - lowest;
  const plotHeight = LOWEST_BALANCE_Y - HIGHEST_BALANCE_Y;

  if (balanceSpan === 0) {
    return (): number => FLAT_BALANCE_Y;
  }

  return (balance): number =>
    LOWEST_BALANCE_Y - ((balance - lowest) / balanceSpan) * plotHeight;
}

export function balanceLinePath(
  dailyBalances: number[],
  balanceY: BalanceY
): string {
  return dailyBalances
    .map((balance, dayIndex) => {
      const command = dayIndex === 0 ? 'M' : 'L';
      const x = dayX(dayIndex, dailyBalances.length).toFixed(1);

      return `${command}${x} ${balanceY(balance).toFixed(1)}`;
    })
    .join(' ');
}

export function totalBalanceFillPath(
  shownBalanceHistories: ShownBalanceHistory[],
  balanceY: BalanceY
): string | undefined {
  const totalBalanceHistory = shownBalanceHistories.find(
    ({ shownBalance }) => shownBalance === 'totalBalance'
  );

  if (!totalBalanceHistory || totalBalanceHistory.dailyBalances.length < 2) {
    return undefined;
  }

  const line = balanceLinePath(totalBalanceHistory.dailyBalances, balanceY);

  return `${line} L ${TODAY_X} ${LOWEST_BALANCE_Y} L ${FIRST_DAY_X} ${LOWEST_BALANCE_Y} Z`;
}

function ticksRoundedTo(
  roundingAgorot: number,
  { lowest, highest }: BalanceBounds
): number[] {
  const tickBalances = Array.from({ length: BALANCE_TICK_COUNT }, (_, step) => {
    const balance =
      lowest + ((highest - lowest) * step) / (BALANCE_TICK_COUNT - 1);

    return Math.round(balance / roundingAgorot) * roundingAgorot;
  });

  return [...new Set(tickBalances)];
}

export function balanceTicks(balanceBounds: BalanceBounds): number[] {
  const wholeShekelTicks = ticksRoundedTo(AGOROT_PER_SHEKEL, balanceBounds);
  const halfShekelTicks = ticksRoundedTo(HALF_SHEKEL_AGOROT, balanceBounds);

  return halfShekelTicks.length > wholeShekelTicks.length
    ? halfShekelTicks
    : wholeShekelTicks;
}

function keptAboveBottom(labels: PlacedTodaysBalance[]): PlacedTodaysBalance[] {
  const lowestLabelY = Math.max(...labels.map((label) => label.y));
  const overflow = lowestLabelY - LOWEST_BALANCE_Y;

  return overflow > 0
    ? labels.map((label) => ({ ...label, y: label.y - overflow }))
    : labels;
}

export function todaysBalancesSpacedApart(
  wantedLabels: PlacedTodaysBalance[]
): PlacedTodaysBalance[] {
  const placed: PlacedTodaysBalance[] = [];
  let nextFreeY = HIGHEST_BALANCE_Y;

  for (const label of [...wantedLabels].sort((a, b) => a.y - b.y)) {
    const y = Math.max(label.y, nextFreeY);
    placed.push({ ...label, y });
    nextFreeY = y + LABEL_GAP;
  }

  return keptAboveBottom(placed);
}
