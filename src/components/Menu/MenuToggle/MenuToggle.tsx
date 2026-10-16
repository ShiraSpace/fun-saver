'use client';

import { JSX, Ref } from 'react';
import { BurgerIcon } from '../BurgerIcon';
import { MENU_TEST_IDS } from '../constants';
import { ToggleButton } from './MenuToggle.styles';

export interface MenuToggleProps {
  ref?: Ref<HTMLButtonElement>;
  isOpen: boolean;
  onToggle: () => void;
}

export function MenuToggle({ ref, isOpen, onToggle }: MenuToggleProps): JSX.Element {
  return (
    <ToggleButton
      ref={ref}
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
