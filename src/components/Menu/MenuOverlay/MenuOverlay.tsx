'use client';

import { JSX } from 'react';
import { GlobalScope } from '../GlobalScope';
import { AccountScope } from '../AccountScope';
import { AppearanceSection } from '../AppearanceSection';
import { LanguageSection } from '../LanguageSection';
import { MENU_OVERLAY_CONTENT, MENU_OVERLAY_TEST_IDS } from './constants';
import { useEscapeDismissal } from './use-escape-dismissal';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { Panel, Content, NavLink } from './MenuOverlay.styles';

export interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isAccountListOpen: boolean;
  onAccountListToggle: (isOpen: boolean) => void;
}

export function MenuOverlay({
  isOpen,
  onClose,
  isAccountListOpen,
  onAccountListToggle,
}: MenuOverlayProps): JSX.Element {
  useEscapeDismissal({
    isOpen,
    onClose,
    isAccountListOpen,
    onAccountListToggle,
  });

  return (
    <Panel
      role="dialog"
      aria-label={MENU_OVERLAY_CONTENT.title}
      data-testid={MENU_OVERLAY_TEST_IDS.overlay}
      data-open={isOpen}
    >
      <Content>
        <GlobalScope
          onLeaveMenu={onClose}
          isAccountListOpen={isAccountListOpen}
          onAccountListToggle={onAccountListToggle}
        />
        <AccountScope>
          <AppearanceSection />
          <LanguageSection />
        </AccountScope>
        <NavLink
          href={METHOD_ROUTE}
          data-testid={MENU_OVERLAY_TEST_IDS.methodLink}
          onClick={onClose}
        >
          {MENU_OVERLAY_CONTENT.methodLink}
        </NavLink>
      </Content>
    </Panel>
  );
}
