import {
  renderHook,
  waitFor,
  type RenderHookResult,
} from '@testing-library/react';
import { REQUEST_STATE } from '@/lib/request-state';
import { useMatchingPictures } from './use-matching-pictures';

jest.mock('@/lib/goal/picture-search/picture-words.he.json', () => {
  throw new Error('the word list did not download');
});

describe('useMatchingPictures when the word list cannot load', () => {
  const mockQuery = 'אופניים';
  let hook: RenderHookResult<ReturnType<typeof useMatchingPictures>, unknown>;

  beforeEach(async () => {
    hook = renderHook(() => useMatchingPictures(mockQuery));
    await waitFor(() =>
      expect(hook.result.current.requestState).not.toBe(REQUEST_STATE.pending)
    );
  });

  it('reports the load as failed', () => {
    expect(hook.result.current.requestState).toBe(REQUEST_STATE.failed);
  });
});
