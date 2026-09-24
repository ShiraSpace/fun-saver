'use client';

import { JSX, ReactNode } from 'react';
import { SignedInUserSection } from '../SignedInUserSection';
import { MENU_USER_SETTINGS_TEST_IDS } from './constants';
import { UserSettingsBlock } from './MenuUserSettings.styles';

interface MenuUserSettingsProps {
  children: ReactNode;
}

export function MenuUserSettings({
  children,
}: MenuUserSettingsProps): JSX.Element {
  return (
    <UserSettingsBlock data-testid={MENU_USER_SETTINGS_TEST_IDS.block}>
      <SignedInUserSection />
      {children}
    </UserSettingsBlock>
  );
}
