import { JSX } from 'react';
import { WALLET_HERO_COPY, WALLET_HERO_TEST_IDS } from './constants';

interface HeroWallet {
  balance: number;
  monthlyInterestRate: number;
  openedAt: string;
}

interface WalletHeroProps {
  name: string;
  wallet: HeroWallet;
}

export function WalletHero({ name, wallet }: WalletHeroProps): JSX.Element {
  return (
    <div>
      <div>
        <span data-testid={WALLET_HERO_TEST_IDS.icon}>
          {WALLET_HERO_COPY.icon}
        </span>
        <span data-testid={WALLET_HERO_TEST_IDS.eyebrow}>
          {WALLET_HERO_COPY.eyebrow(name)}
        </span>
        <span data-testid={WALLET_HERO_TEST_IDS.interestRate}>
          {WALLET_HERO_COPY.interestRate(wallet.monthlyInterestRate)}
        </span>
        <span data-testid={WALLET_HERO_TEST_IDS.activeSince}>
          {WALLET_HERO_COPY.activeSince(wallet.openedAt)}
        </span>
      </div>
      <span data-testid={WALLET_HERO_TEST_IDS.balance}>{wallet.balance}</span>
    </div>
  );
}
