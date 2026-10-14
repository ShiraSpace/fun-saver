import { act } from '@testing-library/react';
import {
  advanceTime,
  fakeTimersEachTest,
  mockHoldMs,
  renderUseHoldToCancel,
  type HoldToCancelHook,
} from '@/test-utils/hold-to-cancel';
import type { HoldPointerEvent } from './use-hold-to-cancel';
import { PRIMARY_POINTER_BUTTON } from './constants';

const mockPointerId = 1;

function createMockPointerDown(button = PRIMARY_POINTER_BUTTON): HoldPointerEvent {
  return {
    button,
    pointerId: mockPointerId,
    currentTarget: { releasePointerCapture: jest.fn() },
  };
}

describe('useHoldToCancel', () => {
  const mockOnHeld = jest.fn();
  let hook: HoldToCancelHook;

  const pressPointer = (button?: number): void =>
    act(() => hook.result.current.handlers.onPointerDown(createMockPointerDown(button)));

  fakeTimersEachTest();

  beforeEach(() => {
    mockOnHeld.mockClear();
    hook = renderUseHoldToCancel(mockOnHeld);
  });

  describe('a pointer held for 2 seconds', () => {
    beforeEach(() => {
      pressPointer();
      advanceTime(mockHoldMs);
    });

    it('calls onHeld', () => {
      expect(mockOnHeld).toHaveBeenCalledTimes(1);
    });

    it('stops reporting a hold once it is done', () => {
      expect(hook.result.current.isHolding).toBe(false);
    });
  });

  it('reports a hold while the pointer is still held', () => {
    pressPointer();

    expect(hook.result.current.isHolding).toBe(true);
  });

  it('does not call onHeld when the pointer is let go before 2 seconds', () => {
    pressPointer();
    advanceTime(mockHoldMs - 1);
    act(() => hook.result.current.handlers.onPointerUp());
    advanceTime(mockHoldMs);

    expect(mockOnHeld).not.toHaveBeenCalled();
  });

  describe('a hold interrupted before 2 seconds', () => {
    const holdThenInterrupt = (interrupt: () => void): void => {
      pressPointer();
      advanceTime(mockHoldMs - 1);
      act(interrupt);
      advanceTime(mockHoldMs);
    };

    it('by pointercancel does not call onHeld', () => {
      holdThenInterrupt(() => hook.result.current.handlers.onPointerCancel());

      expect(mockOnHeld).not.toHaveBeenCalled();
    });

    it('by the pointer leaving the button does not call onHeld', () => {
      holdThenInterrupt(() => hook.result.current.handlers.onPointerLeave());

      expect(mockOnHeld).not.toHaveBeenCalled();
    });

    it('by the button losing focus does not call onHeld', () => {
      holdThenInterrupt(() => hook.result.current.handlers.onBlur());

      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });

  it('releases the pointer capture on a press, so sliding off the button lets go', () => {
    const mockPointerDown = createMockPointerDown();

    act(() => hook.result.current.handlers.onPointerDown(mockPointerDown));

    expect(mockPointerDown.currentTarget.releasePointerCapture).toHaveBeenCalledWith(mockPointerId);
  });

  it('does not call onHeld when a secondary mouse button is held for 2 seconds', () => {
    const mockSecondaryButton = 2;

    pressPointer(mockSecondaryButton);
    advanceTime(mockHoldMs);

    expect(mockOnHeld).not.toHaveBeenCalled();
  });

  it('does not call onHeld for a hold while the goal is being cancelled', () => {
    hook = renderUseHoldToCancel(mockOnHeld, true);
    pressPointer();
    advanceTime(mockHoldMs);

    expect(mockOnHeld).not.toHaveBeenCalled();
  });

  it('does not call onHeld when the button goes away mid-hold', () => {
    pressPointer();
    hook.unmount();
    advanceTime(mockHoldMs);

    expect(mockOnHeld).not.toHaveBeenCalled();
  });
});
