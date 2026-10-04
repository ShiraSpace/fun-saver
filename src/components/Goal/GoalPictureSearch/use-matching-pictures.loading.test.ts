import { renderHook, type RenderHookResult } from '@testing-library/react';
import { REQUEST_STATE } from '@/lib/request-state';
import { useMatchingPictures } from './use-matching-pictures';

describe('useMatchingPictures before the word list has ever loaded', () => {
  const mockQuery = 'אופניים';
  let hook: RenderHookResult<ReturnType<typeof useMatchingPictures>, unknown>;

  beforeEach(() => {
    hook = renderHook(() => useMatchingPictures(mockQuery));
  });

  it('is waiting for the word list', () => {
    expect(hook.result.current.requestState).toBe(REQUEST_STATE.pending);
  });
});
