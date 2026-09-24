import type { WalletName } from '@/lib/types';
import { DEPOSIT_SPLIT, WALLET_ICON, WALLET_NAME } from '@/lib/constants';
import { percentLabel } from '../constants';

export const EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS = {
  row: 'method-example-row',
  wallet: 'method-example-wallet',
} as const;

export const EXAMPLE_WALLET_SPLIT_ROW_COPY = {
  walletShare: (walletName: WalletName): string =>
    `${WALLET_ICON[walletName]} ${WALLET_NAME[walletName]} ${percentLabel(DEPOSIT_SPLIT[walletName])}`,
} as const;
