import { JSX } from 'react';
import { WALLET_HERO_TEST_IDS } from './constants';

interface WalletHeroProps {
  wallet: { balance: number };
}

export function WalletHero({ wallet }: WalletHeroProps): JSX.Element {
  return (
    <span data-testid={WALLET_HERO_TEST_IDS.balance}>{wallet.balance}</span>
  );
}
