import { fireEvent, render, screen } from '@/test-utils/render';
import { pressHoldToCancel, stubPointerSupportEachTest } from '@/test-utils/cancel-goal';
import { REQUEST_STATE } from '@/lib/request-state';
import { HoldToCancel } from './HoldToCancel';
import { HOLD_TO_CANCEL_COPY, HOLD_TO_CANCEL_TEST_IDS } from './constants';

function renderHoldToCancel(): void {
  render(<HoldToCancel requestState={REQUEST_STATE.idle} cancelGoal={jest.fn()} />);
}

describe('HoldToCancel', () => {
  stubPointerSupportEachTest();

  describe('at rest', () => {
    beforeEach(() => {
      renderHoldToCancel();
    });

    it('tells screen readers to hold it for 2 seconds', () => {
      expect(screen.getByTestId(HOLD_TO_CANCEL_TEST_IDS.button)).toHaveAccessibleName(
        HOLD_TO_CANCEL_COPY.ariaLabel
      );
    });

    it('stops the phone opening its long-press menu', () => {
      expect(fireEvent.contextMenu(screen.getByTestId(HOLD_TO_CANCEL_TEST_IDS.button))).toBe(false);
    });
  });

  it('fills while held', () => {
    renderHoldToCancel();
    pressHoldToCancel();

    expect(screen.getByTestId(HOLD_TO_CANCEL_TEST_IDS.fill)).toHaveAttribute(
      'data-filling',
      'true'
    );
  });
});
