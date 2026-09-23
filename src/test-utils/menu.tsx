import { Fragment, JSX, ReactNode } from 'react';
import { fireEvent, screen } from '@/test-utils/render';
import { MenuProvider, useMenuState } from '@/components/Menu/use-menu-state';

const MENU_TOGGLE_TESTID = 'toggle-menu';

interface WithToggleableMenuProps {
  children: ReactNode;
}

export function WithToggleableMenu({
  children,
}: WithToggleableMenuProps): JSX.Element {
  const menu = useMenuState();

  return (
    <Fragment>
      <button data-testid={MENU_TOGGLE_TESTID} onClick={menu.toggle} />
      <MenuProvider value={menu}>{children}</MenuProvider>
    </Fragment>
  );
}

export function toggleMenu(): void {
  fireEvent.click(screen.getByTestId(MENU_TOGGLE_TESTID));
}

export function closeAndReopenMenu(): void {
  toggleMenu();
  toggleMenu();
}
