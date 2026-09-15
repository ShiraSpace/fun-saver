import { render, screen } from '@/test-utils/render';
import { GoalOutcome } from './GoalOutcome';
import { GOAL_OUTCOME_TEST_IDS } from './constants';

describe('a goal outcome', () => {
  const OUTCOME = { icon: '🐷', body: 'להתאמן בהמתנה' };
  const NOTE = 'ככה מגיעה ההבנה הראשונה של ריבית';

  describe('when the copy attaches a note to it', () => {
    beforeEach(() => {
      render(<GoalOutcome {...OUTCOME} note={NOTE} />);
    });

    it('carries the note, so the reason sits with the outcome that earns it', () => {
      expect(screen.getByTestId(GOAL_OUTCOME_TEST_IDS.note)).toHaveTextContent(
        NOTE
      );
    });
  });

  describe('when the copy attaches none', () => {
    beforeEach(() => {
      render(<GoalOutcome {...OUTCOME} />);
    });

    it('leaves the note out rather than opening an empty line under the body', () => {
      expect(
        screen.queryByTestId(GOAL_OUTCOME_TEST_IDS.note)
      ).not.toBeInTheDocument();
    });
  });

  describe('when the note itself carries emphasis', () => {
    const MARKED_NOTE = 'נוספים **מטבעות** בכל יום';

    beforeEach(() => {
      render(<GoalOutcome {...OUTCOME} note={MARKED_NOTE} />);
    });

    it('renders it through the same emphasis as the body, so no markers reach the page', () => {
      expect(screen.getByTestId(GOAL_OUTCOME_TEST_IDS.note)).toHaveTextContent(
        'נוספים מטבעות בכל יום'
      );
    });
  });
});
