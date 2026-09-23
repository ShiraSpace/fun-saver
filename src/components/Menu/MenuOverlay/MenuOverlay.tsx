'use client';

import { JSX } from 'react';
import { MenuBody } from '../MenuBody';
import { useMenu } from '../use-menu-state';
import { MENU_OVERLAY_CONTENT, MENU_OVERLAY_TEST_IDS } from './constants';
import { useEscapeKey } from './use-escape-key';
import { Panel, Content } from './MenuOverlay.styles';

export function MenuOverlay(): JSX.Element {
  const { isOpen, close } = useMenu();

  useEscapeKey({ isListening: isOpen, onEscape: close });

  return (
    <Panel
      role="dialog"
      aria-label={MENU_OVERLAY_CONTENT.title}
      data-testid={MENU_OVERLAY_TEST_IDS.overlay}
      data-open={isOpen}
      inert={!isOpen}
    >
      <Content key={String(isOpen)}>
        <MenuBody />
      </Content>
    </Panel>
  );
}
