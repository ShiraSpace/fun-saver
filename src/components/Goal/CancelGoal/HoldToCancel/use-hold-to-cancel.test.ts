import { act, renderHook, type RenderHookResult } from '@testing-library/react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useHoldToCancel } from './use-hold-to-cancel';

type HoldToCancelHook = RenderHookResult<ReturnType<typeof useHoldToCancel>, unknown>;

const mockHoldMs = 2000;

const mockPointerId = 1;

function createMockPointerDown(button = 0): ReactPointerEvent<HTMLElement> {
  return {
    button,
    pointerId: mockPointerId,
    currentTarget: { releasePointerCapture: jest.fn() },
  } as unknown as ReactPointerEvent<HTMLElement>;
}

function createMockKeyEvent(key = ' ', repeat = false): ReactKeyboardEvent<HTMLElement> {
  return { key, repeat } as ReactKeyboardEvent<HTMLElement>;
}

function advanceTime(milliseconds: number): void {
  act(() => {
    jest.advanceTimersByTime(milliseconds);
  });
}

function renderHoldToCancel(onHeld: () => void, isCancelling = false): HoldToCancelHook {
  return renderHook(() => useHoldToCancel({ holdMs: mockHoldMs, isCancelling, onHeld }));
}

describe('useHoldToCancel', () => {
  const mockOnHeld = jest.fn();
  let hook: HoldToCancelHook;

  const pressPointer = (button?: number): void =>
    act(() => hook.result.current.handlers.onPointerDown(createMockPointerDown(button)));

  const pressKey = (key?: string, repeat?: boolean): void =>
    act(() => hook.result.current.handlers.onKeyDown(createMockKeyEvent(key, repeat)));

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnHeld.mockClear();
    hook = renderHoldToCancel(mockOnHeld);
  });

  afterEach(() => {
    jest.useRealTimers();
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

  describe('a pointer still held', () => {
    beforeEach(() => {
      pressPointer();
    });

    it('reports a hold', () => {
      expect(hook.result.current.isHolding).toBe(true);
    });
  });

  describe('a pointer let go before 2 seconds', () => {
    beforeEach(() => {
      pressPointer();
      advanceTime(mockHoldMs - 1);
      act(() => hook.result.current.handlers.onPointerUp());
      advanceTime(mockHoldMs);
    });

    it('does not call onHeld', () => {
      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });

  describe('a hold interrupted before 2 seconds', () => {
    const holdThenInterrupt = (interrupt: () => void): void => {
      pressPointer();
      advanceTime(mockHoldMs - 1);
      act(interrupt);
      advanceTime(mockHoldMs);
    };

    describe('by pointercancel', () => {
      beforeEach(() => {
        holdThenInterrupt(() => hook.result.current.handlers.onPointerCancel());
      });

      it('does not call onHeld', () => {
        expect(mockOnHeld).not.toHaveBeenCalled();
      });
    });

    describe('by the pointer leaving the button', () => {
      beforeEach(() => {
        holdThenInterrupt(() => hook.result.current.handlers.onPointerLeave());
      });

      it('does not call onHeld', () => {
        expect(mockOnHeld).not.toHaveBeenCalled();
      });
    });

    describe('by the button losing focus', () => {
      beforeEach(() => {
        holdThenInterrupt(() => hook.result.current.handlers.onBlur());
      });

      it('does not call onHeld', () => {
        expect(mockOnHeld).not.toHaveBeenCalled();
      });
    });
  });

  describe('a pointer press', () => {
    const mockPointerDown = createMockPointerDown();

    beforeEach(() => {
      act(() => hook.result.current.handlers.onPointerDown(mockPointerDown));
    });

    it('releases the pointer capture, so sliding off the button lets go', () => {
      expect(mockPointerDown.currentTarget.releasePointerCapture).toHaveBeenCalledWith(
        mockPointerId
      );
    });
  });

  describe('a secondary mouse button held for 2 seconds', () => {
    const mockSecondaryButton = 2;

    beforeEach(() => {
      pressPointer(mockSecondaryButton);
      advanceTime(mockHoldMs);
    });

    it('does not call onHeld', () => {
      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });

  describe('a key held long enough to repeat', () => {
    const mockRepeatAfterMs = 500;

    beforeEach(() => {
      pressKey();
      advanceTime(mockRepeatAfterMs);
      pressKey(' ', true);
      advanceTime(mockHoldMs - mockRepeatAfterMs);
    });

    it('calls onHeld 2 seconds after the first press', () => {
      expect(mockOnHeld).toHaveBeenCalledTimes(1);
    });
  });

  describe('Enter held for 2 seconds', () => {
    beforeEach(() => {
      pressKey('Enter');
      advanceTime(mockHoldMs);
    });

    it('calls onHeld', () => {
      expect(mockOnHeld).toHaveBeenCalledTimes(1);
    });
  });

  describe('another key held for 2 seconds', () => {
    beforeEach(() => {
      pressKey('a');
      advanceTime(mockHoldMs);
    });

    it('does not call onHeld', () => {
      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });

  describe('a key hold', () => {
    const letGoOfKey = (key: string): void =>
      act(() => hook.result.current.handlers.onKeyUp(createMockKeyEvent(key)));

    beforeEach(() => {
      pressKey();
      advanceTime(mockHoldMs - 1);
    });

    describe('let go of before 2 seconds', () => {
      beforeEach(() => {
        letGoOfKey(' ');
        advanceTime(mockHoldMs);
      });

      it('does not call onHeld', () => {
        expect(mockOnHeld).not.toHaveBeenCalled();
      });
    });

    describe('while another key is let go', () => {
      beforeEach(() => {
        letGoOfKey('Shift');
        advanceTime(1);
      });

      it('carries on and calls onHeld', () => {
        expect(mockOnHeld).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('a hold while the goal is being cancelled', () => {
    beforeEach(() => {
      hook = renderHoldToCancel(mockOnHeld, true);
      pressPointer();
      advanceTime(mockHoldMs);
    });

    it('does not call onHeld', () => {
      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });

  describe('a hold whose button goes away', () => {
    beforeEach(() => {
      pressPointer();
      hook.unmount();
      advanceTime(mockHoldMs);
    });

    it('does not call onHeld', () => {
      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });
});
