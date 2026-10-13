import { render, screen } from '@/test-utils/render';
import { REQUEST_STATE } from '@/lib/request-state';
import { SaveGoalButton } from './SaveGoalButton';
import { SAVE_GOAL_BUTTON_COPY, SAVE_GOAL_BUTTON_TEST_IDS } from './constants';

const mockSubmitLabel = '✓ קובעים יעד';

describe('SaveGoalButton', () => {
  describe('before saving', () => {
    beforeEach(() => {
      render(<SaveGoalButton submitLabel={mockSubmitLabel} requestState={REQUEST_STATE.idle} />);
    });

    it('shows its label', () => {
      expect(screen.getByTestId(SAVE_GOAL_BUTTON_TEST_IDS.submit)).toHaveTextContent(
        mockSubmitLabel
      );
    });

    it('can be tapped', () => {
      expect(screen.getByTestId(SAVE_GOAL_BUTTON_TEST_IDS.submit)).toBeEnabled();
    });

    it('shows no loader', () => {
      expect(screen.queryByTestId(SAVE_GOAL_BUTTON_TEST_IDS.loader)).not.toBeInTheDocument();
    });
  });

  describe('while saving', () => {
    beforeEach(() => {
      render(<SaveGoalButton submitLabel={mockSubmitLabel} requestState={REQUEST_STATE.pending} />);
    });

    it('says it is saving', () => {
      expect(screen.getByTestId(SAVE_GOAL_BUTTON_TEST_IDS.submit)).toHaveTextContent(
        SAVE_GOAL_BUTTON_COPY.saving
      );
    });

    it('shows the loader', () => {
      expect(screen.getByTestId(SAVE_GOAL_BUTTON_TEST_IDS.loader)).toBeInTheDocument();
    });

    it('cannot be tapped again', () => {
      expect(screen.getByTestId(SAVE_GOAL_BUTTON_TEST_IDS.submit)).toBeDisabled();
    });
  });

  it('shows the save error once saving failed', () => {
    render(<SaveGoalButton submitLabel={mockSubmitLabel} requestState={REQUEST_STATE.failed} />);

    expect(screen.getByTestId(SAVE_GOAL_BUTTON_TEST_IDS.saveError)).toHaveTextContent(
      SAVE_GOAL_BUTTON_COPY.saveError
    );
  });
});
