import { render, screen } from '@/test-utils/render';
import { KeyPoint } from './KeyPoint';
import { KEY_POINT_TEST_IDS } from './constants';

describe('a goal outcome', () => {
  const OUTCOME = { icon: '🐷', body: 'להתאמן בהמתנה' };
  const NOTE = 'ככה מגיעה ההבנה הראשונה של ריבית';

  describe('when the copy attaches a note to it', () => {
    beforeEach(() => {
      render(<KeyPoint {...OUTCOME} note={NOTE} />);
    });

    it('carries the note, so the reason sits with the outcome that earns it', () => {
      expect(screen.getByTestId(KEY_POINT_TEST_IDS.note)).toHaveTextContent(
        NOTE
      );
    });
  });

  describe('when the copy attaches none', () => {
    beforeEach(() => {
      render(<KeyPoint {...OUTCOME} />);
    });

    it('leaves the note out rather than opening an empty line under the body', () => {
      expect(
        screen.queryByTestId(KEY_POINT_TEST_IDS.note)
      ).not.toBeInTheDocument();
    });
  });

  describe('when the note itself carries emphasis', () => {
    const MARKED_NOTE = 'נוספים **מטבעות** בכל יום';

    beforeEach(() => {
      render(<KeyPoint {...OUTCOME} note={MARKED_NOTE} />);
    });

    it('renders it through the same emphasis as the body, so no markers reach the page', () => {
      expect(screen.getByTestId(KEY_POINT_TEST_IDS.note)).toHaveTextContent(
        'נוספים מטבעות בכל יום'
      );
    });
  });
});
