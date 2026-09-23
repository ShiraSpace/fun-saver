import { fireEvent, render, screen } from '@/test-utils/render';
import { ProfilePhoto } from './ProfilePhoto';
import { PROFILE_SECTION_TEST_IDS } from './constants';

const GOOGLE_PHOTO = 'https://lh3.googleusercontent.com/a/photo';

const photo = (): HTMLElement | null =>
  screen.queryByTestId(PROFILE_SECTION_TEST_IDS.photo);

const mark = (): HTMLElement | null =>
  screen.queryByTestId(PROFILE_SECTION_TEST_IDS.mark);

describe('ProfilePhoto', () => {
  describe('when the user has a photo', () => {
    beforeEach(() => {
      render(<ProfilePhoto image={GOOGLE_PHOTO} />);
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
      render(<ProfilePhoto />);
    });

    it('shows the neutral mark', () => {
      expect(mark()).toBeInTheDocument();
      expect(photo()).not.toBeInTheDocument();
    });
  });
});
