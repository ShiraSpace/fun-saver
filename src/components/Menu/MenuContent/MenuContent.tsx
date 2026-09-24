'use client';

import { Fragment, JSX } from 'react';
import { useOptionalAccounts } from '@/components/Home/accounts-context';
import { MenuUserSettings } from '../MenuUserSettings';
import { MenuAccountSettings } from '../MenuAccountSettings';
import { AccountControls } from '../AccountControls';
import { AddAccountButton } from '../AddAccountButton';
import { AppearanceSection } from '../AppearanceSection';
import { LanguageSection } from '../LanguageSection';
import { NavigationTabs } from '../NavigationTabs';
import { useMenu } from '../use-menu-state';

export function MenuContent(): JSX.Element {
  const hasAccount = Boolean(useOptionalAccounts());
  const { closeMenu } = useMenu();

  const accountControls = hasAccount ? (
    <AccountControls />
  ) : (
    <AddAccountButton />
  );

  return (
    <Fragment>
      <NavigationTabs onNavigate={closeMenu} />
      <MenuUserSettings>{accountControls}</MenuUserSettings>
      {hasAccount && (
        <MenuAccountSettings>
          <AppearanceSection />
          <LanguageSection />
        </MenuAccountSettings>
      )}
    </Fragment>
  );
}
