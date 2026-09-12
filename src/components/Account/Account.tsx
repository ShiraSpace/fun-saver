'use client';

import { JSX, useState } from 'react';
import styled from '@emotion/styled';
import type { AccountWithDerivedWallets } from '@/lib/types';
import { totalBalance } from '@/lib/derivations';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { ActionButton } from '@/components/ActionButton';
import { OverviewCard } from './OverviewCard';
import { WalletList } from './WalletList/WalletList';
import { TransactionDrawer } from './TransactionDrawer';
import { ACCOUNT_COPY, ACCOUNT_LAYOUT, ACCOUNT_TEST_IDS } from './constants';

const Column = styled.div`
  width: 100%;
  max-width: ${ACCOUNT_LAYOUT.maxWidth}px;
  display: flex;
  flex-direction: column;
  gap: ${ACCOUNT_LAYOUT.gap}px;
  padding: ${ACCOUNT_LAYOUT.paddingY}px ${ACCOUNT_LAYOUT.paddingX}px;
  overflow: hidden;
`;

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
