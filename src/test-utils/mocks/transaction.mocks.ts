import { TRANSACTION_TYPE } from '@/lib/constants';
import type { Transaction } from '@/lib/types';
import { createMockTransaction, mockOpeningDeposit } from './general.mocks';

export const mockBusyDay = '2026-01-02';

export const mockBusyDayDeposit: Transaction = createMockTransaction({
  id: 'busy-day-deposit',
  amount: 300,
  occurredAt: mockBusyDay,
  createdAt: '2026-01-02T08:00:00.000Z',
});

export const mockBusyDayWithdrawal: Transaction = createMockTransaction({
  id: 'busy-day-withdrawal',
  walletId: 'w2',
  type: TRANSACTION_TYPE.withdrawal,
  amount: 200,
  occurredAt: mockBusyDay,
  createdAt: '2026-01-02T12:00:00.000Z',
});

const mockBusyDayInterest: Transaction = createMockTransaction({
  id: 'busy-day-interest',
  type: TRANSACTION_TYPE.interest,
  amount: 9,
  occurredAt: mockBusyDay,
  createdAt: '2026-01-03T06:00:00.000Z',
});

export const mockBusyDayTransactions: Transaction[] = [
  mockOpeningDeposit,
  mockBusyDayDeposit,
  mockBusyDayWithdrawal,
  mockBusyDayInterest,
];
