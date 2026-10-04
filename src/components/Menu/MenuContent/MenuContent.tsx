'use client';

import { Fragment, JSX } from 'react';
import { isShownToChild } from '@/lib/account/view-mode';
import { useOptionalAccounts } from '@/components/Home/accounts-context';
import { MenuUserSettings } from '../MenuUserSettings';
import { MenuAccountSettings } from '../MenuAccountSettings';
import { AccountControls } from '../AccountControls';
import { AddAccountButton } from '../AddAccountButton';
import { AppearanceSection } from '../AppearanceSection';
import { LanguageSection } from '../LanguageSection';
import { ChildMenuContent } from '../ChildMenuContent';
import { NavigationTabs } from '../NavigationTabs';
import { useMenu } from '../use-menu-state';

export function MenuContent(): JSX.Element {
  const accounts = useOptionalAccounts();
  const hasAccount = Boolean(accounts);
  const { closeMenu } = useMenu();

  if (accounts && isShownToChild(accounts.currentAccount)) {
    return <ChildMenuContent />;
  }

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
