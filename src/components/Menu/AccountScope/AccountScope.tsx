'use client';

import { JSX, ReactNode } from 'react';
import { Avatar } from '@/components/Avatar/Avatar';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  ACCOUNT_SCOPE_CONTENT,
  ACCOUNT_SCOPE_STYLE,
  ACCOUNT_SCOPE_TEST_IDS,
} from './constants';
import { AccountBlock, Head, Note } from './AccountScope.styles';

interface AccountScopeProps {
  children: ReactNode;
}

export function AccountScope({ children }: AccountScopeProps): JSX.Element {
  const { currentAccount } = useAccounts();

  return (
    <AccountBlock data-testid={ACCOUNT_SCOPE_TEST_IDS.block}>
      <Head data-testid={ACCOUNT_SCOPE_TEST_IDS.heading}>
        {ACCOUNT_SCOPE_CONTENT.headingPrefix} {currentAccount.name}
        <Avatar
          avatarId={currentAccount.avatarId}
          alt=""
          size={ACCOUNT_SCOPE_STYLE.avatarSize}
        />
      </Head>
      <Note>{ACCOUNT_SCOPE_CONTENT.note}</Note>
      {children}
    </AccountBlock>
  );
}
