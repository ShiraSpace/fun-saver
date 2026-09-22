'use client';

import { Fragment, JSX, useCallback, useState } from 'react';
import { BurgerIcon } from './BurgerIcon';
import { MenuOverlay } from './MenuOverlay';
import { MENU_TEST_IDS } from './constants';
import { ToggleButton } from './Menu.styles';

export interface MenuProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

export function Menu({ isOpen, onToggle }: MenuProps): JSX.Element {
  const [isAccountListOpen, setIsAccountListOpen] = useState(false);

  const toggleAccountList = useCallback(
    (): void => setIsAccountListOpen((wasOpen) => !wasOpen),
    []
  );

  const toggle = useCallback((): void => {
    setIsAccountListOpen(false);
    onToggle(!isOpen);
  }, [isOpen, onToggle]);

  const close = useCallback((): void => {
    setIsAccountListOpen(false);
    onToggle(false);
  }, [onToggle]);

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
      <MenuOverlay
        isOpen={isOpen}
        onClose={close}
        isAccountListOpen={isAccountListOpen}
        onAccountListToggle={toggleAccountList}
      />
    </Fragment>
  );
}
