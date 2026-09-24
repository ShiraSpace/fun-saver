'use client';

import { JSX, memo } from 'react';
import { MenuBody } from '../MenuBody';
import { useMenu } from '../use-menu-state';
import { MENU_OVERLAY_CONTENT, MENU_OVERLAY_TEST_IDS } from './constants';
import { useEscapeKey } from '../use-escape-key';
import { Panel, Content } from './MenuOverlay.styles';

export const MenuOverlay = memo(function MenuOverlay(): JSX.Element {
  const { isOpen, closeMenu } = useMenu();

  useEscapeKey({ isListening: isOpen, onEscape: closeMenu });

  return (
    <Panel
      role="dialog"
      aria-label={MENU_OVERLAY_CONTENT.title}
      data-testid={MENU_OVERLAY_TEST_IDS.overlay}
      data-open={isOpen}
      inert={!isOpen}
    >
      <Content>
        <MenuBody />
      </Content>
    </Panel>
  );
});
