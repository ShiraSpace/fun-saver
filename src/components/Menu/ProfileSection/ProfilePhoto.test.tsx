import { fireEvent, render, screen } from '@/test-utils/render';
import { ProfilePhoto } from './ProfilePhoto';
import { PROFILE_SECTION_TEST_IDS } from './constants';
import { MenuProvider } from '../use-menu-state';
import { mockMenu } from '@/test-utils/fixtures';
import {
  closeAndReopenMenu,
  toggleMenu,
  WithToggleableMenu,
} from '@/test-utils/menu';

const GOOGLE_PHOTO = 'https://lh3.googleusercontent.com/a/photo';

const photo = (): HTMLElement | null =>
  screen.queryByTestId(PROFILE_SECTION_TEST_IDS.photo);

const mark = (): HTMLElement | null =>
  screen.queryByTestId(PROFILE_SECTION_TEST_IDS.mark);

describe('ProfilePhoto', () => {
  describe('when the user has a photo', () => {
    beforeEach(() => {
      render(
        <MenuProvider value={mockMenu}>
          <ProfilePhoto image={GOOGLE_PHOTO} />
        </MenuProvider>
      );
    });

    it('shows it instead of the neutral mark', () => {
      expect(photo()).toBeInTheDocument();
      expect(mark()).not.toBeInTheDocument();
    });

    it('asks the browser not to send a referrer, which Google answers 403 to', () => {
      expect(photo()).toHaveAttribute('referrerpolicy', 'no-referrer');
    });

    it('falls back to the mark when the photo fails to load', () => {
      fireEvent.error(photo() as HTMLElement);

      expect(mark()).toBeInTheDocument();
      expect(photo()).not.toBeInTheDocument();
    });
  });

  describe('when the user has no photo', () => {
    beforeEach(() => {
      render(
        <MenuProvider value={mockMenu}>
          <ProfilePhoto />
        </MenuProvider>
      );
    });

    it('shows the neutral mark', () => {
      expect(mark()).toBeInTheDocument();
      expect(photo()).not.toBeInTheDocument();
    });
  });

  describe('when the menu is closed and reopened after the photo failed', () => {
    beforeEach(() => {
      render(
        <WithToggleableMenu>
          <ProfilePhoto image={GOOGLE_PHOTO} />
        </WithToggleableMenu>
      );
      toggleMenu();
      fireEvent.error(photo() as HTMLElement);
      closeAndReopenMenu();
    });

    it('tries the photo again', () => {
      expect(photo()).toBeInTheDocument();
    });
  });
});
