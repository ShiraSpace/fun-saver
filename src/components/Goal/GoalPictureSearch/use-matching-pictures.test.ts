import {
  renderHook,
  waitFor,
  type RenderHookResult,
} from '@testing-library/react';
import { REQUEST_STATE } from '@/lib/request-state';
import { useMatchingPictures } from './use-matching-pictures';

type MatchingPicturesHook = RenderHookResult<
  ReturnType<typeof useMatchingPictures>,
  unknown
>;

describe('useMatchingPictures', () => {
  const mockQueryWithPrefix = 'האופניים';
  let hook: MatchingPicturesHook;

  beforeEach(() => {
    hook = renderHook(() => useMatchingPictures(mockQueryWithPrefix));
  });

  describe('right after mounting', () => {
    it('is waiting for the word list', () => {
      expect(hook.result.current.requestState).toBe(REQUEST_STATE.pending);
    });
  });

  describe('once the word list has loaded', () => {
    const mockQueryPicture = '🚲';

    beforeEach(async () => {
      await waitFor(() =>
        expect(hook.result.current.requestState).not.toBe(REQUEST_STATE.pending)
      );
    });

    it('is no longer waiting', () => {
      expect(hook.result.current.requestState).toBe(REQUEST_STATE.idle);
    });

    it('finds the bicycle for a word typed with a prefix letter', () => {
      expect(hook.result.current.pictures).toContain(mockQueryPicture);
    });
  });
});
