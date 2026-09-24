import { fireEvent, render, screen } from '@/test-utils/render';
import {
  closeAndReopenMenu,
  renderInOpenMenu,
  WithMenu,
} from '@/test-utils/menu';
import { SignedInUserPhoto } from './SignedInUserPhoto';
import { SIGNED_IN_USER_SECTION_TEST_IDS } from './constants';

const GOOGLE_PHOTO = 'https://lh3.googleusercontent.com/a/photo';

const photo = (): HTMLElement | null =>
  screen.queryByTestId(SIGNED_IN_USER_SECTION_TEST_IDS.photo);

const mark = (): HTMLElement | null =>
  screen.queryByTestId(SIGNED_IN_USER_SECTION_TEST_IDS.photoPlaceholder);

describe('SignedInUserPhoto', () => {
  describe('when the user has a photo', () => {
    beforeEach(() => {
      render(
        <WithMenu>
          <SignedInUserPhoto image={GOOGLE_PHOTO} />
        </WithMenu>
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
        <WithMenu>
          <SignedInUserPhoto />
        </WithMenu>
      );
    });

    it('shows the neutral mark', () => {
      expect(mark()).toBeInTheDocument();
      expect(photo()).not.toBeInTheDocument();
    });
  });

  describe('when the menu is closed and reopened after the photo failed', () => {
    beforeEach(() => {
      renderInOpenMenu(<SignedInUserPhoto image={GOOGLE_PHOTO} />);
      fireEvent.error(photo() as HTMLElement);
      closeAndReopenMenu();
    });

    it('tries the photo again', () => {
      expect(photo()).toBeInTheDocument();
    });
  });
});
