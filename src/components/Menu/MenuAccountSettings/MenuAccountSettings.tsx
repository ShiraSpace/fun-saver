'use client';

import { JSX, ReactNode } from 'react';
import { Avatar } from '@/components/Avatar/Avatar';
import { useAccounts } from '@/components/Home/accounts-context';
import {
  SettingsSection,
  SettingsHeading,
  SettingsNote,
} from '../settings-parts';
import {
  MENU_ACCOUNT_SETTINGS_COPY,
  MENU_ACCOUNT_SETTINGS_STYLE,
  MENU_ACCOUNT_SETTINGS_TEST_IDS,
} from './constants';

interface MenuAccountSettingsProps {
  children: ReactNode;
}

export function MenuAccountSettings({
  children,
}: MenuAccountSettingsProps): JSX.Element {
  const { currentAccount } = useAccounts();

  return (
    <SettingsSection data-testid={MENU_ACCOUNT_SETTINGS_TEST_IDS.block}>
      <SettingsHeading data-testid={MENU_ACCOUNT_SETTINGS_TEST_IDS.heading}>
        {MENU_ACCOUNT_SETTINGS_COPY.headingPrefix} {currentAccount.name}
        <Avatar
          avatarId={currentAccount.avatarId}
          alt=""
          size={MENU_ACCOUNT_SETTINGS_STYLE.avatarSize}
        />
      </SettingsHeading>
      <SettingsNote>{MENU_ACCOUNT_SETTINGS_COPY.note}</SettingsNote>
      {children}
    </SettingsSection>
  );
}
