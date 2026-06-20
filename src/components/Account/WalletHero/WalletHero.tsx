import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { Money } from '../Money/Money';
import { WALLET_HERO_COPY, WALLET_HERO_TEST_IDS } from './constants';

type HeroWallet = Pick<
  WalletWithDerived,
  'balance' | 'principal' | 'interestGain' | 'monthlyInterestRate' | 'openedAt'
>;

interface WalletHeroProps {
  name: string;
  wallet: HeroWallet;
}

interface BreakdownCellProps {
  label: string;
  amountAgorot: number;
  testId: string;
}

function BreakdownCell({
  label,
  amountAgorot,
  testId,
}: BreakdownCellProps): JSX.Element {
  return (
    <div>
      <span>{label}</span>
      <Money amountAgorot={amountAgorot} testId={testId} />
    </div>
  );
}

export function WalletHero({ name, wallet }: WalletHeroProps): JSX.Element {
  return (
    <div data-testid={WALLET_HERO_TEST_IDS.hero}>
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
      <Money
        amountAgorot={wallet.balance}
        testId={WALLET_HERO_TEST_IDS.balance}
      />
      <BreakdownCell
        label={WALLET_HERO_COPY.depositsLabel}
        amountAgorot={wallet.principal}
        testId={WALLET_HERO_TEST_IDS.deposits}
      />
      <BreakdownCell
        label={WALLET_HERO_COPY.interestGainLabel}
        amountAgorot={wallet.interestGain}
        testId={WALLET_HERO_TEST_IDS.interestGain}
      />
    </div>
  );
}
