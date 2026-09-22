import type { WalletName } from '@/lib/types';
import { DEPOSIT_SPLIT, WALLET_ICON, WALLET_NAME } from '@/lib/constants';
import { WALLET_TRIO_COPY } from '../WalletTrio/constants';

export const EXAMPLE_WALLET_SPLIT_ROW_TEST_IDS = {
  row: 'method-example-row',
  wallet: 'method-example-wallet',
} as const;

export const EXAMPLE_WALLET_SPLIT_ROW_COPY = {
  wallet: (wallet: WalletName): string =>
    `${WALLET_ICON[wallet]} ${WALLET_NAME[wallet]} ${WALLET_TRIO_COPY.share(
      DEPOSIT_SPLIT[wallet]
    )}`,
} as const;
