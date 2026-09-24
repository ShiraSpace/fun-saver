import type { WalletName } from '@/lib/types';
import { DEPOSIT_SHARES, WALLET_ICON, WALLET_LABEL } from '@/lib/constants';
import { percentLabel } from '../constants';

export const EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS = {
  row: 'method-example-row',
  wallet: 'method-example-wallet',
} as const;

export const EXAMPLE_WALLET_SPLIT_ROW_COPY = {
  walletShare: (walletName: WalletName): string =>
    `${WALLET_ICON[walletName]} ${WALLET_LABEL[walletName]} ${percentLabel(DEPOSIT_SHARES[walletName])}`,
} as const;
