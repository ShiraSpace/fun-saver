import { MONEY_COPY } from '@/components/Money/constants';

export const WALLET_PICKER_TEST_IDS = {
  wallet: (name: string): string => `wallet-picker-${name}`,
  balance: (name: string): string => `wallet-picker-balance-${name}`,
} as const;

export const WALLET_PICKER_COPY = {
  stillToSave: (stillToSaveShekels: number): string =>
    `עוד ${MONEY_COPY.currencySign}${stillToSaveShekels} ליעד`,
} as const;
