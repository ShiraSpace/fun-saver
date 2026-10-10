export const mockAddDeposit = jest.fn().mockResolvedValue(undefined);
export const mockAddWithdrawal = jest.fn().mockResolvedValue(undefined);

export function useAddTransaction(): {
  addDeposit: jest.Mock;
  addWithdrawal: jest.Mock;
} {
  return { addDeposit: mockAddDeposit, addWithdrawal: mockAddWithdrawal };
}
