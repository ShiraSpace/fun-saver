import { act, renderHook } from '@testing-library/react';
import { useOinkThenRun } from './use-oink-then-run';

describe('useOinkThenRun', () => {
  it('oinks on click without running the callback yet', () => {
    const mockOnDone = jest.fn();
    const { result } = renderHook(() => useOinkThenRun(mockOnDone));

    act(() => result.current.onCreateAccountClick());

    expect(result.current.isOinking).toBe(true);
    expect(mockOnDone).not.toHaveBeenCalled();
  });

  it('runs the callback once the pig is done oinking', () => {
    const mockOnDone = jest.fn();
    const { result } = renderHook(() => useOinkThenRun(mockOnDone));

    act(() => result.current.onPigDoneOinking());

    expect(mockOnDone).toHaveBeenCalled();
  });
});
