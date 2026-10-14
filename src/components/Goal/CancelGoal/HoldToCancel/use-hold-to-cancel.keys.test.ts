import { act } from '@testing-library/react';
import {
  advanceTime,
  fakeTimersEachTest,
  mockHoldMs,
  renderUseHoldToCancel,
  type HoldToCancelHook,
} from '@/test-utils/hold-to-cancel';
import type { HoldKeyEvent } from './use-hold-to-cancel';

function createMockKeyEvent(key = ' ', repeat = false): HoldKeyEvent & { repeat: boolean } {
  return { key, repeat };
}

describe('useHoldToCancel, by keyboard', () => {
  const mockOnHeld = jest.fn();
  let hook: HoldToCancelHook;

  const pressKey = (key?: string, repeat?: boolean): void =>
    act(() => hook.result.current.handlers.onKeyDown(createMockKeyEvent(key, repeat)));

  fakeTimersEachTest();

  beforeEach(() => {
    mockOnHeld.mockClear();
    hook = renderUseHoldToCancel(mockOnHeld);
  });

  it('calls onHeld 2 seconds after the first press of a key held long enough to repeat', () => {
    const mockRepeatAfterMs = 500;

    pressKey();
    advanceTime(mockRepeatAfterMs);
    pressKey(' ', true);
    advanceTime(mockHoldMs - mockRepeatAfterMs);

    expect(mockOnHeld).toHaveBeenCalledTimes(1);
  });

  it('calls onHeld when Enter is held for 2 seconds', () => {
    pressKey('Enter');
    advanceTime(mockHoldMs);

    expect(mockOnHeld).toHaveBeenCalledTimes(1);
  });

  it('does not call onHeld when another key is held for 2 seconds', () => {
    pressKey('a');
    advanceTime(mockHoldMs);

    expect(mockOnHeld).not.toHaveBeenCalled();
  });

  it('finishes a new key hold after the button lost focus during the first', () => {
    pressKey();
    advanceTime(mockHoldMs / 2);
    act(() => hook.result.current.handlers.onBlur());
    pressKey('Enter');
    advanceTime(mockHoldMs);

    expect(mockOnHeld).toHaveBeenCalledTimes(1);
  });

  describe('a key hold', () => {
    const letGoOfKey = (key: string): void =>
      act(() => hook.result.current.handlers.onKeyUp(createMockKeyEvent(key)));

    beforeEach(() => {
      pressKey();
      advanceTime(mockHoldMs - 1);
    });

    it('does not call onHeld when let go of before 2 seconds', () => {
      letGoOfKey(' ');
      advanceTime(mockHoldMs);

      expect(mockOnHeld).not.toHaveBeenCalled();
    });

    it('carries on and calls onHeld while the other hold key is let go', () => {
      letGoOfKey('Enter');
      advanceTime(1);

      expect(mockOnHeld).toHaveBeenCalledTimes(1);
    });

    it('does not start over when the other hold key is pressed too, so onHeld comes on time', () => {
      pressKey('Enter');
      advanceTime(1);

      expect(mockOnHeld).toHaveBeenCalledTimes(1);
    });
  });
});
