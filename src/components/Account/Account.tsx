'use client';

import { JSX, useState } from 'react';
import styled from '@emotion/styled';
import type { WalletWithDerived } from '@/lib/types';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { ActionButton } from '@/components/ActionButton';
import { WalletHero } from './WalletHero/WalletHero';
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
`;

interface AccountProps {
  accountId: string;
  name: string;
  avatarId: string;
  wallets: WalletWithDerived[];
}

export function Account({
  accountId,
  name,
  avatarId,
  wallets,
}: AccountProps): JSX.Element {
  const savings = wallets.find((wallet) => wallet.name === 'savings')!;
  const others = wallets.filter((wallet) => wallet.name !== 'savings')!;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Screen align="top">
      <Column>
        <Header name={name} avatarId={avatarId} />
        {savings && <WalletHero name={name} wallet={savings} />}
        <WalletList wallets={others} />
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
          accountId={accountId}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </Screen>
  );
}
