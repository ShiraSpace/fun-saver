'use client';

import { JSX, useCallback } from 'react';
import { AccountsSection } from '../AccountsSection';
import { AppearanceSection } from '../AppearanceSection';
import { LanguageSection } from '../LanguageSection';
import { MENU_OVERLAY_CONTENT, MENU_OVERLAY_TEST_IDS } from './constants';
import { useEscapeKey } from './use-escape-key';
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
  const closePickerThenMenu = useCallback((): void => {
    if (isAccountListOpen) {
      onAccountListToggle(false);
      return;
    }

    onClose();
  }, [isAccountListOpen, onAccountListToggle, onClose]);

  useEscapeKey(isOpen, closePickerThenMenu);

  return (
    <Panel
      role="dialog"
      aria-label={MENU_OVERLAY_CONTENT.title}
      data-testid={MENU_OVERLAY_TEST_IDS.overlay}
      data-open={isOpen}
    >
      <Content>
        <AccountsSection
          onAccountSelect={onClose}
          isAccountListOpen={isAccountListOpen}
          onAccountListToggle={onAccountListToggle}
        />
        <AppearanceSection />
        <LanguageSection />
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
