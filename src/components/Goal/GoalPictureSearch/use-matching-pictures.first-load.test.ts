import {
  renderHook,
  waitFor,
  type RenderHookResult,
} from '@testing-library/react';
import { REQUEST_STATE } from '@/lib/request-state';
import { useMatchingPictures } from './use-matching-pictures';

describe('useMatchingPictures on the first load of the word list', () => {
  const mockQuery = 'אופניים';
  const mockQueryEmoji = '🚲';
  let hook: RenderHookResult<ReturnType<typeof useMatchingPictures>, unknown>;

  beforeEach(async () => {
    hook = renderHook(() => useMatchingPictures(mockQuery));
    await waitFor(() =>
      expect(hook.result.current.requestState).toBe(REQUEST_STATE.idle)
    );
  });

  it('finds pictures as soon as the word list arrives', () => {
    expect(hook.result.current.foundEmoji).toContain(mockQueryEmoji);
  });
});
