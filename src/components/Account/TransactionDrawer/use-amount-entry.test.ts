import { act, renderHook, waitFor } from '@testing-library/react';
import { StatusCodes } from 'http-status-codes';
import { RequestFailedError } from '@/lib/fetch-json';
import { REQUEST_STATE } from '@/lib/request-state';
import { mockRouter } from '@mocks/next/navigation';
import { useAmountEntry } from './use-amount-entry';

function submitRefusedWith(
  status: number
): ReturnType<typeof renderHook<ReturnType<typeof useAmountEntry>, void>> {
  const mockSaveTransaction = jest
    .fn()
    .mockRejectedValue(new RequestFailedError('refused', status));
  const hook = renderHook(() => useAmountEntry(mockSaveTransaction, jest.fn()));

  act(() => hook.result.current.onSubmit());

  return hook;
}

describe('useAmountEntry', () => {
  beforeEach(() => {
    mockRouter.refresh.mockClear();
  });

  describe('when the server refuses with a conflict', () => {
    it('refreshes the page', async () => {
      submitRefusedWith(StatusCodes.CONFLICT);

      await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
    });

    it('goes back to idle rather than failed', async () => {
      const { result } = submitRefusedWith(StatusCodes.CONFLICT);

      await waitFor(() => expect(mockRouter.refresh).toHaveBeenCalled());
      expect(result.current.requestState).toBe(REQUEST_STATE.idle);
    });
  });

  describe('when the request fails any other way', () => {
    it('fails', async () => {
      const { result } = submitRefusedWith(StatusCodes.BAD_REQUEST);

      await waitFor(() =>
        expect(result.current.requestState).toBe(REQUEST_STATE.failed)
      );
    });

    it('refreshes nothing', async () => {
      const { result } = submitRefusedWith(StatusCodes.BAD_REQUEST);

      await waitFor(() =>
        expect(result.current.requestState).toBe(REQUEST_STATE.failed)
      );
      expect(mockRouter.refresh).not.toHaveBeenCalled();
    });
  });
});
