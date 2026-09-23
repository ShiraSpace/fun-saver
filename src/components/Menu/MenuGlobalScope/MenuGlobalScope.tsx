'use client';

import { JSX, ReactNode } from 'react';
import { ProfileSection } from '../ProfileSection';
import { MENU_GLOBAL_SCOPE_TEST_IDS } from './constants';
import { GlobalBlock } from './MenuGlobalScope.styles';

interface MenuGlobalScopeProps {
  children: ReactNode;
}

export function MenuGlobalScope({
  children,
}: MenuGlobalScopeProps): JSX.Element {
  return (
    <GlobalBlock data-testid={MENU_GLOBAL_SCOPE_TEST_IDS.block}>
      <ProfileSection />
      {children}
    </GlobalBlock>
  );
}
