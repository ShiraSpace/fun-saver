import { JSX } from 'react';
import { DEPOSIT_SPLIT } from '@/lib/constants';
import type { MethodPot } from '../copy';
import { WALLET_TRIO_COPY, WALLET_TRIO_TEST_IDS } from './constants';
import { Icon, Name, Pot, Share, Trio } from './WalletTrio.styles';

interface WalletTrioProps {
  pots: readonly MethodPot[];
}

export function WalletTrio({ pots }: WalletTrioProps): JSX.Element {
  const blocks = pots.map((pot) => (
    <Pot
      key={pot.wallet}
      walletName={pot.wallet}
      data-testid={WALLET_TRIO_TEST_IDS.pot}
    >
      <Icon aria-hidden="true">{pot.icon}</Icon>
      <Name>{pot.name}</Name>
      <Share data-testid={WALLET_TRIO_TEST_IDS.share}>
        {WALLET_TRIO_COPY.share(DEPOSIT_SPLIT[pot.wallet])}
      </Share>
    </Pot>
  ));

  return <Trio data-testid={WALLET_TRIO_TEST_IDS.trio}>{blocks}</Trio>;
}
