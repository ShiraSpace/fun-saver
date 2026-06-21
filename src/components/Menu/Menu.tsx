'use client';

import { Fragment, JSX, useState } from 'react';
import styled from '@emotion/styled';
import { BurgerIcon } from './BurgerIcon';
import { MenuOverlay } from './MenuOverlay';
import { MENU_ICON, MENU_TEST_IDS, MENU_TOGGLE } from './constants';

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
`;

export function Menu(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <ToggleButton
        type="button"
        aria-expanded={isOpen}
        data-testid={MENU_TEST_IDS.menuButton}
        onClick={(): void => setIsOpen((open) => !open)}
      >
        <BurgerIcon isOpen={isOpen} testId={MENU_TEST_IDS.menuIcon} />
      </ToggleButton>
      <MenuOverlay isOpen={isOpen} onClose={(): void => setIsOpen(false)} />
    </Fragment>
  );
}
