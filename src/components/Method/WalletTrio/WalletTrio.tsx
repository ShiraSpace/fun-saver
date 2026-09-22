import { JSX } from 'react';
import type { WalletName } from '@/lib/types';
import { DEPOSIT_SPLIT, WALLET_ICON, WALLET_NAME } from '@/lib/constants';
import { WALLET_TRIO_COPY, WALLET_TRIO_TEST_IDS } from './constants';
import { Icon, Name, Pot, Share, Trio } from './WalletTrio.styles';

interface WalletTrioProps {
  pots: readonly WalletName[];
}

export function WalletTrio({ pots }: WalletTrioProps): JSX.Element {
  const blocks = pots.map((wallet) => (
    <Pot
      key={wallet}
      walletName={wallet}
      data-testid={WALLET_TRIO_TEST_IDS.pot}
    >
      <Icon aria-hidden="true">{WALLET_ICON[wallet]}</Icon>
      <Name>{WALLET_NAME[wallet]}</Name>
      <Share data-testid={WALLET_TRIO_TEST_IDS.share}>
        {WALLET_TRIO_COPY.share(DEPOSIT_SPLIT[wallet])}
      </Share>
    </Pot>
  ));

  return <Trio data-testid={WALLET_TRIO_TEST_IDS.trio}>{blocks}</Trio>;
}
