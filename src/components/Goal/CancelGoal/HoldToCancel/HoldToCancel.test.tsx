import { createRef } from 'react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { pressHoldToCancel, stubPointerSupportEachTest } from '@/test-utils/cancel-goal';
import { HoldToCancel } from './HoldToCancel';
import { HOLD_TO_CANCEL_COPY, HOLD_TO_CANCEL_TEST_IDS } from './constants';

function renderHoldToCancel(): void {
  render(
    <HoldToCancel
      ref={createRef<HTMLButtonElement>()}
      isCancelling={false}
      cancelFailed={false}
      cancelGoal={jest.fn()}
    />
  );
}

const fill = (): HTMLElement => screen.getByTestId(HOLD_TO_CANCEL_TEST_IDS.fill);

describe('HoldToCancel', () => {
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

  describe('while held', () => {
    stubPointerSupportEachTest();

    beforeEach(() => {
      renderHoldToCancel();
      pressHoldToCancel();
    });

    it('fills', () => {
      expect(fill()).toHaveAttribute('data-filling', 'true');
    });
  });
});
