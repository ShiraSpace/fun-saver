import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import Link from 'next/link';
import { MENU_LABEL_STYLE } from '../MenuLabel/constants';
import {
  MENU_LINK_STYLE,
  MENU_OVERLAY_LAYOUT,
  MENU_OVERLAY_STYLE,
} from './constants';

const sheet = ({ theme }: { theme: Theme }): string => theme.colors.softBg;

const onSheet = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

const labelSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.label;

export const Panel = styled.div`
  position: fixed;
  inset: ${MENU_OVERLAY_LAYOUT.top}px 0 0;
  z-index: ${MENU_OVERLAY_STYLE.zIndex};
  box-sizing: border-box;
  padding-bottom: ${MENU_OVERLAY_STYLE.paddingBottom}px;
  overflow-y: auto;
  background: ${sheet};
  color: ${onSheet};
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

export const Content = styled.div`
  padding: ${MENU_OVERLAY_LAYOUT.contentPaddingTop}px
    ${MENU_OVERLAY_LAYOUT.contentPaddingX}px 0;
`;

export const NavLink = styled(Link)`
  display: block;
  margin-top: ${MENU_LABEL_STYLE.marginTop}px;
  padding: ${MENU_LINK_STYLE.paddingY}px 2px;
  border-top: 1px solid currentColor;
  border-top-color: rgba(255, 255, 255, ${MENU_LINK_STYLE.dividerOpacity});
  border-radius: ${MENU_LINK_STYLE.radius}px;
  text-align: start;
  font-size: ${labelSize}px;
  font-weight: 700;
  letter-spacing: ${MENU_LABEL_STYLE.letterSpacing}px;
  color: inherit;
  text-decoration: none;
`;
