'use client';

import { JSX, memo } from 'react';
import { MenuBody } from '../MenuBody';
import { MENU_OVERLAY_CONTENT, MENU_OVERLAY_TEST_IDS } from './constants';
import { useEscapeDismissal } from './use-escape-dismissal';
import { Panel, Content } from './MenuOverlay.styles';

export interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isAccountListOpen: boolean;
  onAccountListToggle: (isOpen: boolean) => void;
}

export const MenuOverlay = memo(function MenuOverlay({
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
      inert={!isOpen}
    >
      <Content>
        <MenuBody
          onLeaveMenu={onClose}
          isAccountListOpen={isAccountListOpen}
          onAccountListToggle={onAccountListToggle}
        />
      </Content>
    </Panel>
  );
});
