'use client';

import { JSX, useEffect } from 'react';
import { AccountsSection } from '../AccountsSection';
import { AppearanceSection } from '../AppearanceSection';
import { LanguageSection } from '../LanguageSection';
import {
  ESCAPE_KEY,
  MENU_OVERLAY_CONTENT,
  MENU_OVERLAY_TEST_IDS,
} from './constants';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { Panel, Content, NavLink } from './MenuOverlay.styles';

export interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuOverlay({
  isOpen,
  onClose,
}: MenuOverlayProps): JSX.Element {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === ESCAPE_KEY) {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return (): void => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <Panel
      role="dialog"
      aria-label={MENU_OVERLAY_CONTENT.title}
      data-testid={MENU_OVERLAY_TEST_IDS.overlay}
      data-open={isOpen}
    >
      <Content>
        <AccountsSection onAccountSelect={onClose} />
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
