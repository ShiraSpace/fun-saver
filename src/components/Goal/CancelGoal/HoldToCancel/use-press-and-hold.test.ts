import { act, renderHook, type RenderHookResult } from '@testing-library/react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { usePressAndHold } from './use-press-and-hold';

type PressAndHoldHook = RenderHookResult<ReturnType<typeof usePressAndHold>, unknown>;

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

function waitFor(milliseconds: number): void {
  act(() => {
    jest.advanceTimersByTime(milliseconds);
  });
}

function renderPressAndHold(onHeld: () => void, isDisabled = false): PressAndHoldHook {
  return renderHook(() => usePressAndHold({ holdMs: mockHoldMs, isDisabled, onHeld }));
}

describe('usePressAndHold', () => {
  const mockOnHeld = jest.fn();
  let hook: PressAndHoldHook;

  const pressPointer = (button?: number): void =>
    act(() => hook.result.current.handlers.onPointerDown(createMockPointerDown(button)));

  const pressKey = (key?: string, repeat?: boolean): void =>
    act(() => hook.result.current.handlers.onKeyDown(createMockKeyEvent(key, repeat)));

  beforeEach(() => {
    jest.useFakeTimers();
    mockOnHeld.mockClear();
    hook = renderPressAndHold(mockOnHeld);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('a pointer held for 2 seconds', () => {
    beforeEach(() => {
      pressPointer();
      waitFor(mockHoldMs);
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
      waitFor(mockHoldMs - 1);
      act(() => hook.result.current.handlers.onPointerUp());
      waitFor(mockHoldMs);
    });

    it('does not call onHeld', () => {
      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });

  describe('a hold interrupted before 2 seconds', () => {
    const holdThenInterrupt = (interrupt: () => void): void => {
      pressPointer();
      waitFor(mockHoldMs - 1);
      act(interrupt);
      waitFor(mockHoldMs);
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
      waitFor(mockHoldMs);
    });

    it('does not call onHeld', () => {
      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });

  describe('a key held long enough to repeat', () => {
    const mockRepeatAfterMs = 500;

    beforeEach(() => {
      pressKey();
      waitFor(mockRepeatAfterMs);
      pressKey(' ', true);
      waitFor(mockHoldMs - mockRepeatAfterMs);
    });

    it('calls onHeld 2 seconds after the first press', () => {
      expect(mockOnHeld).toHaveBeenCalledTimes(1);
    });
  });

  describe('Enter held for 2 seconds', () => {
    beforeEach(() => {
      pressKey('Enter');
      waitFor(mockHoldMs);
    });

    it('calls onHeld', () => {
      expect(mockOnHeld).toHaveBeenCalledTimes(1);
    });
  });

  describe('another key held for 2 seconds', () => {
    beforeEach(() => {
      pressKey('a');
      waitFor(mockHoldMs);
    });

    it('does not call onHeld', () => {
      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });

  describe('a key hold', () => {
    beforeEach(() => {
      pressKey();
      waitFor(mockHoldMs - 1);
    });

    it('let go of before 2 seconds does not call onHeld', () => {
      act(() => hook.result.current.handlers.onKeyUp(createMockKeyEvent()));
      waitFor(mockHoldMs);

      expect(mockOnHeld).not.toHaveBeenCalled();
    });

    it('carries on through another key being let go', () => {
      act(() => hook.result.current.handlers.onKeyUp(createMockKeyEvent('Shift')));
      waitFor(1);

      expect(mockOnHeld).toHaveBeenCalledTimes(1);
    });
  });

  describe('a hold while disabled', () => {
    beforeEach(() => {
      hook = renderPressAndHold(mockOnHeld, true);
      pressPointer();
      waitFor(mockHoldMs);
    });

    it('does not call onHeld', () => {
      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });

  describe('a hold whose button goes away', () => {
    beforeEach(() => {
      pressPointer();
      hook.unmount();
      waitFor(mockHoldMs);
    });

    it('does not call onHeld', () => {
      expect(mockOnHeld).not.toHaveBeenCalled();
    });
  });
});
