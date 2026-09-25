import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import type { Transaction } from '@/lib/transaction/types';
import type { Wallet } from '@/lib/wallet/types';
import { createMockWallets } from './wallet.mocks';

export function createMockTransaction(
  overrides: Partial<Transaction> = {}
): Transaction {
  return {
    id: 't1',
    walletId: 'w1',
    accountId: 'a1',
    type: TRANSACTION_TYPE.deposit,
    amount: 8000,
    occurredAt: '2026-01-01',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export const mockOpeningDeposit: Transaction = createMockTransaction({
  id: 'opening',
  amount: 500,
  occurredAt: '2026-01-01',
});

export const mockWalletDeposits: Transaction[] = createMockWallets().map(
  (wallet, index) =>
    createMockTransaction({
      id: `deposit-${wallet.name}`,
      walletId: wallet.id,
      amount: 100 * (index + 1),
      createdAt: mockOpeningDeposit.createdAt,
    })
);

export const mockMonthOfInterest: Transaction[] = [
  '2026-01-02',
  '2026-01-03',
  '2026-01-04',
].map((occurredAt) =>
  createMockTransaction({
    id: occurredAt,
    type: TRANSACTION_TYPE.interest,
    amount: 9,
    occurredAt,
  })
);

export const mockMonthOfInterestLastDay: string =
  mockMonthOfInterest[mockMonthOfInterest.length - 1].occurredAt;

export function createMockWithdrawal(wallet: Pick<Wallet, 'id'>): Transaction {
  return createMockTransaction({
    id: `withdrawal-${wallet.id}`,
    walletId: wallet.id,
    type: TRANSACTION_TYPE.withdrawal,
    amount: 100,
  });
}

export const mockTransactions: Transaction[] = [
  createMockTransaction(),
  createMockTransaction({
    id: 't2',
    type: TRANSACTION_TYPE.interest,
    amount: 500,
  }),
  createMockTransaction({ id: 't3', walletId: 'w2', amount: 9500 }),
  createMockTransaction({ id: 't4', walletId: 'w3', amount: 4300 }),
  createMockTransaction({
    id: 't5',
    walletId: 'w2',
    type: TRANSACTION_TYPE.withdrawal,
    amount: 4500,
  }),
  createMockTransaction({
    id: 't6',
    walletId: 'w3',
    type: TRANSACTION_TYPE.withdrawal,
    amount: 1800,
  }),
];

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
