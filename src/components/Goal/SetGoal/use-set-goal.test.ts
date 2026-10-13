import { renderHook } from '@testing-library/react';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { restoreFetchAfterEach, stubFetch } from '@/test-utils/stub-fetch';
import { useSetGoal } from './use-set-goal';

const mockRequest = { name: mockGoal.name, amount: 300, picture: mockGoal.picture };

describe('useSetGoal', () => {
  restoreFetchAfterEach();

  it("posts the goal to the account's goals", async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true, json: async () => mockGoal });
    stubFetch(mockFetch);
    const { result } = renderHook(() => useSetGoal());

    await result.current.setGoal({ accountId: mockAccount.id, request: mockRequest });

    expect(mockFetch).toHaveBeenCalledWith(
      `/api/accounts/${mockAccount.id}/goals`,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(mockRequest) })
    );
  });

  it('returns the goal that was set', async () => {
    stubFetch(jest.fn().mockResolvedValue({ ok: true, json: async () => mockGoal }));
    const { result } = renderHook(() => useSetGoal());

    const goal = await result.current.setGoal({ accountId: mockAccount.id, request: mockRequest });

    expect(goal).toEqual(mockGoal);
  });
});
