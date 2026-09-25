import { asObject } from '@/lib/json-object';

export interface WithdrawalInput {
  walletId: string;
  amountShekels: number;
}

export function validDeposit(body: unknown): number | undefined {
  const requested = asObject(body);

  if (typeof requested?.amount !== 'number') {
    return;
  }

  return requested.amount;
}

export function validWithdrawal(body: unknown): WithdrawalInput | undefined {
  const requested = asObject(body);

  if (
    typeof requested?.walletId !== 'string' ||
    typeof requested.amount !== 'number'
  ) {
    return;
  }

  return { walletId: requested.walletId, amountShekels: requested.amount };
}
