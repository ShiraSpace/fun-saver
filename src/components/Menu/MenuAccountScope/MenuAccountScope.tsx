'use client';

import { JSX, ReactNode } from 'react';
import { Avatar } from '@/components/Avatar/Avatar';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  MENU_ACCOUNT_SCOPE_CONTENT,
  MENU_ACCOUNT_SCOPE_STYLE,
  MENU_ACCOUNT_SCOPE_TEST_IDS,
} from './constants';
import { AccountBlock, Head, Note } from './MenuAccountScope.styles';

interface MenuAccountScopeProps {
  children: ReactNode;
}

export function MenuAccountScope({
  children,
}: MenuAccountScopeProps): JSX.Element {
  const { currentAccount } = useAccounts();

  return (
    <AccountBlock data-testid={MENU_ACCOUNT_SCOPE_TEST_IDS.block}>
      <Head data-testid={MENU_ACCOUNT_SCOPE_TEST_IDS.heading}>
        {MENU_ACCOUNT_SCOPE_CONTENT.headingPrefix} {currentAccount.name}
        <Avatar
          avatarId={currentAccount.avatarId}
          alt=""
          size={MENU_ACCOUNT_SCOPE_STYLE.avatarSize}
        />
      </Head>
      <Note>{MENU_ACCOUNT_SCOPE_CONTENT.note}</Note>
      {children}
    </AccountBlock>
  );
}
