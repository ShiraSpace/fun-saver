import { act, renderHook, type RenderHookResult } from '@testing-library/react';
import { useDebouncedValue } from './use-debounced-value';

const mockDelayMs = 200;
const mockEarlierValue = 'אופ';
const mockNewValue = 'אופניים';

describe('useDebouncedValue', () => {
  let hook: RenderHookResult<string, { value: string }>;

  beforeEach(() => {
    jest.useFakeTimers();
    hook = renderHook(({ value }) => useDebouncedValue(value, mockDelayMs), {
      initialProps: { value: mockEarlierValue },
    });
    hook.rerender({ value: mockNewValue });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('just before the delay passes', () => {
    beforeEach(() => {
      act(() => jest.advanceTimersByTime(mockDelayMs - 1));
    });

    it('still holds the earlier value', () => {
      expect(hook.result.current).toBe(mockEarlierValue);
    });
  });

  describe('once the delay passes', () => {
    beforeEach(() => {
      act(() => jest.advanceTimersByTime(mockDelayMs));
    });

    it('holds the new value', () => {
      expect(hook.result.current).toBe(mockNewValue);
    });
  });

  describe('when a newer value arrives before the delay passes', () => {
    const mockNewerValue = 'אופנוע';

    beforeEach(() => {
      act(() => jest.advanceTimersByTime(mockDelayMs / 2));
      hook.rerender({ value: mockNewerValue });
      act(() => jest.advanceTimersByTime(mockDelayMs / 2));
    });

    it('skips the value it replaced', () => {
      expect(hook.result.current).toBe(mockEarlierValue);
    });
  });
});
