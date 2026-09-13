'use client';

import { JSX, useState } from 'react';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { totalBalance } from '@/lib/derivations';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { ActionButton } from '@/components/ActionButton';
import { OverviewCard } from './OverviewCard';
import { WalletList } from './WalletList/WalletList';
import { TransactionDrawer } from './TransactionDrawer';
import { ACCOUNT_COPY, ACCOUNT_TEST_IDS } from './constants';
import { Column } from './Account.styles';

interface AccountProps {
  account: AccountWithDerivedWallets;
}

export function Account({ account }: AccountProps): JSX.Element {
  const { name, avatarId, wallets } = account;
  const savings = wallets.find((wallet) => wallet.name === 'savings');
  const others = wallets.filter((wallet) => wallet.name !== 'savings');
  const ordered = savings ? [savings, ...others] : others;
  const total = totalBalance(wallets);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Screen align="top">
      <Column>
        <Header name={name} avatarId={avatarId} totalBalance={total} />
        <OverviewCard wallets={ordered} />
        <WalletList wallets={ordered} />
        <ActionButton
          type="button"
          data-testid={ACCOUNT_TEST_IDS.actionCta}
          onClick={() => setIsDrawerOpen(true)}
        >
          {ACCOUNT_COPY.actionCta}
        </ActionButton>
      </Column>
      {isDrawerOpen && (
        <TransactionDrawer
          account={account}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </Screen>
  );
}
