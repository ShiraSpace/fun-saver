import { renderHook } from '@testing-library/react';
import { REQUEST_STATE } from '@/lib/request-state';
import { useMatchingPictures } from './use-matching-pictures';

describe('useMatchingPictures before the word list has ever loaded', () => {
  const mockQuery = 'אופניים';

  it('is waiting for the word list', () => {
    const { result } = renderHook(() => useMatchingPictures(mockQuery));

    expect(result.current.requestState).toBe(REQUEST_STATE.pending);
  });
});
