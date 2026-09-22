'use client';

import { JSX } from 'react';
import { BurgerIcon } from '../BurgerIcon';
import { MENU_TEST_IDS } from '../constants';
import { ToggleButton } from './MenuToggle.styles';

export interface MenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MenuToggle({ isOpen, onToggle }: MenuToggleProps): JSX.Element {
  return (
    <ToggleButton
      type="button"
      aria-expanded={isOpen}
      data-open={isOpen}
      data-testid={MENU_TEST_IDS.menuButton}
      onClick={onToggle}
    >
      <BurgerIcon isOpen={isOpen} testId={MENU_TEST_IDS.menuIcon} />
    </ToggleButton>
  );
}
