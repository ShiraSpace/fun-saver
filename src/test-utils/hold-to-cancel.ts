import { act, renderHook, type RenderHookResult } from '@testing-library/react';
import { useHoldToCancel } from '@/components/Goal/CancelGoal/HoldToCancel/use-hold-to-cancel';

export type HoldToCancelHook = RenderHookResult<ReturnType<typeof useHoldToCancel>, unknown>;

export const mockHoldMs = 2000;

export function advanceTime(milliseconds: number): void {
  act(() => {
    jest.advanceTimersByTime(milliseconds);
  });
}

export function renderHoldToCancel(onHeld: () => void, isCancelling = false): HoldToCancelHook {
  return renderHook(() => useHoldToCancel({ holdMs: mockHoldMs, isCancelling, onHeld }));
}
