export const mockAddDeposit = jest.fn().mockResolvedValue(undefined);
export const mockAddWithdrawal = jest.fn().mockResolvedValue(undefined);

export function useAddTransaction(): ReturnType<
  typeof import('../use-add-transaction').useAddTransaction
> {
  return { addDeposit: mockAddDeposit, addWithdrawal: mockAddWithdrawal };
}
