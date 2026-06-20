import { JSX } from 'react';
import type { WalletWithDerived } from '@/lib/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { WalletHero } from './WalletHero/WalletHero';
import { WalletList } from './WalletList/WalletList';

interface AccountProps {
  name: string;
  avatarId: string;
  wallets: WalletWithDerived[];
}

export function Account({
  name,
  avatarId,
  wallets,
}: AccountProps): JSX.Element {
  const savings = wallets.find((wallet) => wallet.name === 'savings');
  const others = wallets.filter((wallet) => wallet.name !== 'savings');

  return (
    <Screen>
      <Header name={name} avatarId={avatarId} />
      {savings && <WalletHero name={name} wallet={savings} />}
      <WalletList wallets={others} />
    </Screen>
  );
}
