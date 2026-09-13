import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { MENU_ICON, MENU_TOGGLE } from './constants';

const openColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

export const ToggleButton = styled.button`
  position: relative;
  z-index: ${MENU_TOGGLE.zIndex};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${MENU_ICON.buttonSize}px;
  height: ${MENU_ICON.buttonSize}px;
  padding: 0;
  border: none;
  background: transparent;
  color: currentColor;
  cursor: pointer;

  &[data-open='true'] {
    color: ${openColor};
  }
`;
