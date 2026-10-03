'use client';

import { Fragment, JSX } from 'react';
import { APP_VIEW_MODE, isChildView } from '@/lib/account/view-mode';
import { useOptionalAccounts } from '@/components/Home/accounts-context';
import { MenuUserSettings } from '../MenuUserSettings';
import { MenuAccountSettings } from '../MenuAccountSettings';
import { AccountControls } from '../AccountControls';
import { AddAccountButton } from '../AddAccountButton';
import { AppearanceSection } from '../AppearanceSection';
import { LanguageSection } from '../LanguageSection';
import { ViewModeSwitch } from '../ViewModeSwitch';
import { ChildMenuContent } from '../ChildMenuContent';
import { NavigationTabs } from '../NavigationTabs';
import { useMenu } from '../use-menu-state';

export function MenuContent(): JSX.Element {
  const accounts = useOptionalAccounts();
  const hasAccount = Boolean(accounts);
  const { closeMenu } = useMenu();

  if (accounts && isChildView(accounts.currentAccount)) {
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
          <ViewModeSwitch viewMode={APP_VIEW_MODE.child} />
        </MenuAccountSettings>
      )}
    </Fragment>
  );
}
