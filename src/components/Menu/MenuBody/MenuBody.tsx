'use client';

import { Fragment, JSX } from 'react';
import { useOptionalAccounts } from '@/components/Home/accounts-context';
import { MenuGlobalScope } from '../MenuGlobalScope';
import { MenuAccountScope } from '../MenuAccountScope';
import { AccountControls } from '../AccountControls';
import { AddAccountButton } from '../AddAccountButton';
import { AppearanceSection } from '../AppearanceSection';
import { LanguageSection } from '../LanguageSection';
import { NavTabs } from '../NavTabs';
import { useMenu } from '../use-menu-state';

export function MenuBody(): JSX.Element {
  const hasAccount = Boolean(useOptionalAccounts());
  const { closeMenu } = useMenu();

  const accountSlot = hasAccount ? <AccountControls /> : <AddAccountButton />;

  return (
    <Fragment>
      <NavTabs onNavigate={closeMenu} />
      <MenuGlobalScope>{accountSlot}</MenuGlobalScope>
      {hasAccount && (
        <MenuAccountScope>
          <AppearanceSection />
          <LanguageSection />
        </MenuAccountScope>
      )}
    </Fragment>
  );
}
