import { JSX } from 'react';
import type { WalletName } from '@/lib/types';
import { DEPOSIT_SPLIT, WALLET_ICON, WALLET_NAME } from '@/lib/constants';
import { share } from '../constants';
import { WALLET_TRIO_TEST_IDS } from './constants';
import { Icon, Name, TrioWallet, Share, Trio } from './WalletTrio.styles';

interface WalletTrioProps {
  walletNames: readonly WalletName[];
}

export function WalletTrio({ walletNames }: WalletTrioProps): JSX.Element {
  const trioWallets = walletNames.map((walletName) => (
    <TrioWallet
      key={walletName}
      walletName={walletName}
      data-testid={WALLET_TRIO_TEST_IDS.wallet}
    >
      <Icon aria-hidden="true">{WALLET_ICON[walletName]}</Icon>
      <Name>{WALLET_NAME[walletName]}</Name>
      <Share data-testid={WALLET_TRIO_TEST_IDS.share}>
        {share(DEPOSIT_SPLIT[walletName])}
      </Share>
    </TrioWallet>
  ));

  return <Trio data-testid={WALLET_TRIO_TEST_IDS.trio}>{trioWallets}</Trio>;
}
