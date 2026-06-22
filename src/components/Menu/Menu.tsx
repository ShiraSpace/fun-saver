'use client';

import { Fragment, JSX, useCallback } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { BurgerIcon } from './BurgerIcon';
import { MenuOverlay } from './MenuOverlay';
import { MENU_ICON, MENU_TEST_IDS, MENU_TOGGLE } from './constants';

const openColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

const ToggleButton = styled.button`
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

export interface MenuProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function Menu({ isOpen, onToggle }: MenuProps): JSX.Element {
  const toggle = useCallback((): void => onToggle(!isOpen), [isOpen, onToggle]);
  const close = useCallback((): void => onToggle(false), [onToggle]);

  return (
    <Fragment>
      <ToggleButton
        type="button"
        aria-expanded={isOpen}
        data-open={isOpen}
        data-testid={MENU_TEST_IDS.menuButton}
        onClick={toggle}
      >
        <BurgerIcon isOpen={isOpen} testId={MENU_TEST_IDS.menuIcon} />
      </ToggleButton>
      <MenuOverlay isOpen={isOpen} onClose={close} />
    </Fragment>
  );
}
