import { createRef } from 'react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { stubPointerEventEachTest } from '@/test-utils/cancel-goal';
import { HoldToCancel } from './HoldToCancel';
import { HOLD_TO_CANCEL_COPY, HOLD_TO_CANCEL_TEST_IDS } from './constants';

function renderHoldToCancel(requestState: RequestState): void {
  render(
    <HoldToCancel
      ref={createRef<HTMLButtonElement>()}
      requestState={requestState}
      onHeld={jest.fn()}
    />
  );
}

const fill = (): HTMLElement => screen.getByTestId(HOLD_TO_CANCEL_TEST_IDS.fill);

describe('HoldToCancel', () => {
  describe('at rest', () => {
    beforeEach(() => {
      renderHoldToCancel(REQUEST_STATE.idle);
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
    stubPointerEventEachTest();

    beforeEach(() => {
      renderHoldToCancel(REQUEST_STATE.idle);
      fireEvent.pointerDown(screen.getByTestId(HOLD_TO_CANCEL_TEST_IDS.button), { button: 0 });
    });

    it('fills', () => {
      expect(fill()).toHaveAttribute('data-filling', 'true');
    });
  });

  describe('while the goal is being cancelled', () => {
    beforeEach(() => {
      renderHoldToCancel(REQUEST_STATE.pending);
    });

    it('stays full', () => {
      expect(fill()).toHaveAttribute('data-filling', 'true');
    });
  });
});
