'use client';

import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import {
  MENU_OVERLAY_LAYOUT,
  MENU_OVERLAY_STYLE,
} from '../MenuOverlay/constants';

const sheet = ({ theme }: { theme: Theme }): string => theme.colors.softBg;

export const MenuHeaderSheet = styled.div`
  position: fixed;
  inset: 0 0 auto;
  height: ${MENU_OVERLAY_LAYOUT.top}px;
  z-index: ${MENU_OVERLAY_STYLE.zIndex};
  background: ${sheet};
  opacity: 0;
  pointer-events: none;
  transition: opacity ${MENU_OVERLAY_STYLE.transitionMs}ms ease;

  &[data-open='true'] {
    opacity: 1;
  }
`;
