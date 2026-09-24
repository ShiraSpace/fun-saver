import { Fragment, JSX, ReactElement, ReactNode } from 'react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { MenuProvider, useMenuState } from '@/components/Menu/use-menu-state';

const MENU_TOGGLE_TESTID = 'toggle-menu';

interface WithMenuProps {
  children: ReactNode;
  closeMenu?: () => void;
}

interface WithToggleableMenuProps {
  children: ReactNode;
}

export function WithMenu({
  children,
  closeMenu = (): void => {},
}: WithMenuProps): JSX.Element {
  return (
    <MenuProvider value={{ isOpen: true, toggle: (): void => {}, closeMenu }}>
      {children}
    </MenuProvider>
  );
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

export function renderInOpenMenu(
  element: ReactElement,
  options?: Parameters<typeof render>[1]
): void {
  render(<WithToggleableMenu>{element}</WithToggleableMenu>, options);
  toggleMenu();
}
