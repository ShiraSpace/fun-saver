import { act, renderHook } from '@testing-library/react';
import { useOinkThenRun } from './use-oink-then-run';

describe('useOinkThenRun', () => {
  it('oinks on click without running the callback yet', () => {
    const onDone = jest.fn();
    const { result } = renderHook(() => useOinkThenRun(onDone));

    act(() => result.current.onCtaClick());

    expect(result.current.isOinking).toBe(true);
    expect(onDone).not.toHaveBeenCalled();
  });

  it('runs the callback once the pig is done oinking', () => {
    const onDone = jest.fn();
    const { result } = renderHook(() => useOinkThenRun(onDone));

    act(() => result.current.onPigDoneOinking());

    expect(onDone).toHaveBeenCalled();
  });
});
