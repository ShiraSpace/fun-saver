import { act } from '@testing-library/react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  advanceTime,
  mockHoldMs,
  renderHoldToCancel,
  type HoldToCancelHook,
} from '@/test-utils/hold-to-cancel';

function createMockKeyEvent(key = ' ', repeat = false): ReactKeyboardEvent<HTMLElement> {
  return { key, repeat } as ReactKeyboardEvent<HTMLElement>;
}

describe('useHoldToCancel, by keyboard', () => {
  const mockOnHeld = jest.fn();
  let hook: HoldToCancelHook;

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

    describe('while the other hold key is let go', () => {
      beforeEach(() => {
        letGoOfKey('Enter');
        advanceTime(1);
      });

      it('carries on and calls onHeld', () => {
        expect(mockOnHeld).toHaveBeenCalledTimes(1);
      });
    });

    describe('while the other hold key is pressed too', () => {
      const mockSecondPressAfterMs = 1;

      beforeEach(() => {
        pressKey('Enter');
        advanceTime(mockSecondPressAfterMs);
      });

      it('does not start the hold over, so onHeld comes on time', () => {
        expect(mockOnHeld).toHaveBeenCalledTimes(1);
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
});
