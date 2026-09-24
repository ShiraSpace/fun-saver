import { render, screen } from '@/test-utils/render';
import { KeyPoint } from './KeyPoint';
import { KEY_POINT_TEST_IDS } from './constants';

describe('a goal outcome', () => {
  const mockOutcome = { icon: '🐷', body: 'להתאמן בהמתנה' };
  const mockNote = 'ככה מגיעה ההבנה הראשונה של ריבית';

  describe('when the copy attaches a note to it', () => {
    beforeEach(() => {
      render(<KeyPoint {...mockOutcome} note={mockNote} />);
    });

    it('carries the note, so the reason sits with the outcome that earns it', () => {
      expect(screen.getByTestId(KEY_POINT_TEST_IDS.note)).toHaveTextContent(
        mockNote
      );
    });
  });

  describe('when the copy attaches none', () => {
    beforeEach(() => {
      render(<KeyPoint {...mockOutcome} />);
    });

    it('leaves the note out rather than opening an empty line under the body', () => {
      expect(
        screen.queryByTestId(KEY_POINT_TEST_IDS.note)
      ).not.toBeInTheDocument();
    });
  });

  describe('when the note itself carries emphasis', () => {
    const mockMarkedNote = 'נוספים **מטבעות** בכל יום';

    beforeEach(() => {
      render(<KeyPoint {...mockOutcome} note={mockMarkedNote} />);
    });

    it('renders it through the same emphasis as the body, so no markers reach the page', () => {
      expect(screen.getByTestId(KEY_POINT_TEST_IDS.note)).toHaveTextContent(
        'נוספים מטבעות בכל יום'
      );
    });
  });
});
