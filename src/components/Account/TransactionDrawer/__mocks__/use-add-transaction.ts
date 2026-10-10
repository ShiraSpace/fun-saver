import type { AddTransaction } from '../use-add-transaction';

export const mockAddDeposit = jest.fn().mockResolvedValue(undefined);
export const mockAddWithdrawal = jest.fn().mockResolvedValue(undefined);

export function useAddTransaction(): AddTransaction {
  return { addDeposit: mockAddDeposit, addWithdrawal: mockAddWithdrawal };
}
