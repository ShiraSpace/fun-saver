import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { HEADER_TEST_IDS } from './constants';
import { MENU_TEST_IDS } from '../Menu/constants';

describe('Header', () => {
  const ACCOUNT_NAME = 'יעל';
  const AVATAR_ID = 'kid-01';

  beforeEach(() => {
    render(<Header name={ACCOUNT_NAME} avatarId={AVATAR_ID} />);
  });

  it('shows the account name', () => {
    expect(screen.getByTestId(HEADER_TEST_IDS.name)).toHaveTextContent(
      ACCOUNT_NAME
    );
  });

  it('contains the menu button', () => {
    expect(screen.getByTestId(MENU_TEST_IDS.menuButton)).toBeInTheDocument();
  });

  it('shows the account avatar', () => {
    const avatar = screen.getByTestId(HEADER_TEST_IDS.avatar);
    expect(avatar).toHaveAttribute('src', expect.stringContaining(AVATAR_ID));
  });
});
