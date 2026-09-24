'use client';

import { JSX, ReactNode } from 'react';
import { Avatar } from '@/components/Avatar/Avatar';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  MENU_ACCOUNT_SETTINGS_COPY,
  MENU_ACCOUNT_SETTINGS_STYLE,
  MENU_ACCOUNT_SETTINGS_TEST_IDS,
} from './constants';
import { AccountSettingsBlock, Head, Note } from './MenuAccountSettings.styles';

interface MenuAccountSettingsProps {
  children: ReactNode;
}

export function MenuAccountSettings({
  children,
}: MenuAccountSettingsProps): JSX.Element {
  const { currentAccount } = useAccounts();

  return (
    <AccountSettingsBlock data-testid={MENU_ACCOUNT_SETTINGS_TEST_IDS.block}>
      <Head data-testid={MENU_ACCOUNT_SETTINGS_TEST_IDS.heading}>
        {MENU_ACCOUNT_SETTINGS_COPY.headingPrefix} {currentAccount.name}
        <Avatar
          avatarId={currentAccount.avatarId}
          alt=""
          size={MENU_ACCOUNT_SETTINGS_STYLE.avatarSize}
        />
      </Head>
      <Note>{MENU_ACCOUNT_SETTINGS_COPY.note}</Note>
      {children}
    </AccountSettingsBlock>
  );
}
