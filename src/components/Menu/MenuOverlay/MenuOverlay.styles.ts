import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { MENU_OVERLAY_LAYOUT, MENU_OVERLAY_STYLE } from './constants';

const surface = ({ theme }: { theme: Theme }): string => theme.gradients.screen;

const onSurface = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

export const Panel = styled.div`
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

export const Content = styled.div`
  padding: ${MENU_OVERLAY_LAYOUT.contentPaddingTop}px
    ${MENU_OVERLAY_LAYOUT.contentPaddingX}px 0;
`;
