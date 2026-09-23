'use client';

import { Fragment, JSX } from 'react';
import { useOptionalAccounts } from '@/components/Home/accounts-context';
import { MenuGlobalScope } from '../MenuGlobalScope';
import { MenuAccountScope } from '../MenuAccountScope';
import { AccountControls } from '../AccountControls';
import { AddAccountRow } from '../AddAccountRow';
import { AppearanceSection } from '../AppearanceSection';
import { LanguageSection } from '../LanguageSection';
import { NavTabs } from '../NavTabs';
import { useMenu } from '../use-menu-state';

export function MenuBody(): JSX.Element {
  const hasAccount = Boolean(useOptionalAccounts());
  const { close } = useMenu();

  const accountSlot = hasAccount ? <AccountControls /> : <AddAccountRow />;

  return (
    <Fragment>
      <NavTabs onNavigate={close} />
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
