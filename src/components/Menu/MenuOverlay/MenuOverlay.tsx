'use client';

import { JSX, useEffect } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { MENU_ICON } from '../constants';
import {
  ESCAPE_KEY,
  MENU_OVERLAY_CONTENT,
  MENU_OVERLAY_LAYOUT,
  MENU_OVERLAY_STYLE,
  MENU_OVERLAY_TEST_IDS,
} from './constants';

const surface = ({ theme }: { theme: Theme }): string => theme.gradients.screen;
const onSurface = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

const Panel = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${MENU_OVERLAY_STYLE.zIndex};
  box-sizing: border-box;
  padding-bottom: ${MENU_OVERLAY_STYLE.paddingBottom}px;
  overflow-y: auto;
  background: ${surface};
  color: ${onSurface};
  opacity: 0;
  transform: scale(${MENU_OVERLAY_STYLE.closedScale});
  transform-origin: top right;
  pointer-events: none;
  transition:
    opacity ${MENU_OVERLAY_STYLE.transitionMs}ms ease,
    transform ${MENU_OVERLAY_STYLE.transitionMs}ms
      cubic-bezier(0.6, 0.2, 0.25, 1);

  &[data-open='true'] {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }
`;

const StatusbarSpacer = styled.div`
  height: ${MENU_OVERLAY_LAYOUT.statusbarSpacer}px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${MENU_OVERLAY_LAYOUT.barGap}px;
  margin: ${MENU_OVERLAY_LAYOUT.barMarginTop}px
    ${MENU_OVERLAY_LAYOUT.barMarginX}px 0;
  padding: ${MENU_OVERLAY_LAYOUT.barPaddingY}px
    ${MENU_OVERLAY_LAYOUT.barPaddingX}px;
`;

const ToggleSpacer = styled.div`
  width: ${MENU_ICON.buttonSize}px;
  flex-shrink: 0;
`;

const Title = styled.span`
  flex: 1;
  text-align: center;
  font-weight: ${MENU_OVERLAY_LAYOUT.titleWeight};
`;

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
      <StatusbarSpacer />
      <TopBar>
        <ToggleSpacer />
        <Title>{MENU_OVERLAY_CONTENT.title}</Title>
        <ToggleSpacer />
      </TopBar>
    </Panel>
  );
}
