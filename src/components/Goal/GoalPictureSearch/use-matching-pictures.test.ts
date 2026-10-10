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

  describe('once the word list has loaded', () => {
    const mockQueryEmoji = '🚲';

    beforeEach(async () => {
      await waitFor(() =>
        expect(hook.result.current.requestState).not.toBe(REQUEST_STATE.pending)
      );
    });

    it('is no longer waiting', () => {
      expect(hook.result.current.requestState).toBe(REQUEST_STATE.idle);
    });

    it('finds the bicycle for a word typed with a prefix letter', () => {
      expect(hook.result.current.foundEmoji).toContain(mockQueryEmoji);
    });

    describe('and the sheet opens again', () => {
      let reopenedHook: MatchingPicturesHook;

      beforeEach(() => {
        hook.unmount();
        reopenedHook = renderHook(() =>
          useMatchingPictures(mockQueryWithPrefix)
        );
      });

      it('starts with the pictures already found', () => {
        expect(reopenedHook.result.current.foundEmoji).toContain(
          mockQueryEmoji
        );
      });
    });
  });
});
