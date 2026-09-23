import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { SCREEN_LAYOUT } from '@/components/Screen/constants';
import { MENU_OVERLAY_LAYOUT, MENU_OVERLAY_STYLE } from './constants';

const sheet = ({ theme }: { theme: Theme }): string => theme.colors.softBg;

const onSheet = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

export const Panel = styled.div`
  position: fixed;
  inset: ${MENU_OVERLAY_LAYOUT.top}px 0 0;
  z-index: ${MENU_OVERLAY_STYLE.zIndex};
  box-sizing: border-box;
  padding-bottom: ${MENU_OVERLAY_STYLE.paddingBottom}px;
  overflow-y: auto;
  scrollbar-gutter: stable both-edges;
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
  box-sizing: border-box;
  max-width: ${SCREEN_LAYOUT.maxWidth}px;
  margin-inline: auto;
  padding: ${MENU_OVERLAY_LAYOUT.contentPaddingTop}px
    ${SCREEN_LAYOUT.paddingX}px 0;
`;
