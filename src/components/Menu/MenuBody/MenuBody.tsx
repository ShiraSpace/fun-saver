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

interface MenuBodyProps {
  onLeaveMenu: () => void;
  isAccountListOpen: boolean;
  onAccountListToggle: (isOpen: boolean) => void;
}

export function MenuBody({
  onLeaveMenu,
  isAccountListOpen,
  onAccountListToggle,
}: MenuBodyProps): JSX.Element {
  const hasAccount = Boolean(useOptionalAccounts());

  const accountSlot = hasAccount ? (
    <AccountControls
      onLeaveMenu={onLeaveMenu}
      isAccountListOpen={isAccountListOpen}
      onAccountListToggle={onAccountListToggle}
    />
  ) : (
    <AddAccountRow onLeaveMenu={onLeaveMenu} />
  );

  return (
    <Fragment>
      <NavTabs onNavigate={onLeaveMenu} />
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
