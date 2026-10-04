import { InMemoryStore } from '@/db/memory-store';
import { ValidationError } from '@/lib/errors';
import {
  mockAccount,
  mockSiblingAccount,
} from '@/test-utils/mocks/account.mocks';
import { createMockGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { GOAL_ENDING } from '../constants';
import { GoalAlreadyActiveError, GoalNotActiveError } from '../errors';
import { cancelGoal, setGoal } from '../goals';

describe('setGoal', () => {
  const mockGoalBody = {
    name: mockGoal.name,
    amount: 300,
    picture: mockGoal.picture,
  };
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('stores the goal with its amount in agorot', async () => {
    await setGoal({ store, accountId: mockAccount.id, body: mockGoalBody });

    expect(await store.getActiveGoal(mockAccount.id)).toEqual({
      id: expect.any(String),
      accountId: mockAccount.id,
      name: mockGoal.name,
      amount: 30000,
      picture: mockGoal.picture,
      startedAt: expect.any(String),
    });
  });

  it('stores the name trimmed', async () => {
    await setGoal({
      store,
      accountId: mockAccount.id,
      body: { ...mockGoalBody, name: `  ${mockGoal.name}  ` },
    });

    expect((await store.getActiveGoal(mockAccount.id))?.name).toBe(
      mockGoal.name
    );
  });

  it('refuses an invalid body with ValidationError and stores nothing', async () => {
    await expect(
      setGoal({
        store,
        accountId: mockAccount.id,
        body: { ...mockGoalBody, amount: 0 },
      })
    ).rejects.toThrow(ValidationError);
    expect(await store.getActiveGoal(mockAccount.id)).toBeUndefined();
  });

  it('refuses a second goal while the first is still active', async () => {
    await setGoal({ store, accountId: mockAccount.id, body: mockGoalBody });

    await expect(
      setGoal({ store, accountId: mockAccount.id, body: mockGoalBody })
    ).rejects.toThrow(GoalAlreadyActiveError);
  });
});

describe('cancelGoal', () => {
  let store: InMemoryStore;

  beforeEach(async () => {
    store = new InMemoryStore();
    await store.insertGoal(createMockGoal());
  });

  it('ends the active goal as cancelled', async () => {
    const cancelledGoal = await cancelGoal({
      store,
      accountId: mockAccount.id,
      goalId: mockGoal.id,
    });

    expect(cancelledGoal).toEqual({
      ...mockGoal,
      endedAt: expect.any(String),
      ending: GOAL_ENDING.cancelled,
    });
    expect(await store.getActiveGoal(mockAccount.id)).toBeUndefined();
  });

  it('refuses with GoalNotActiveError a goal that has already ended', async () => {
    await cancelGoal({ store, accountId: mockAccount.id, goalId: mockGoal.id });

    await expect(
      cancelGoal({ store, accountId: mockAccount.id, goalId: mockGoal.id })
    ).rejects.toThrow(GoalNotActiveError);
  });

  it('refuses with GoalNotActiveError another account’s goal', async () => {
    const mockSiblingGoal = createMockGoal({
      id: 'g2',
      accountId: mockSiblingAccount.id,
    });
    await store.insertGoal(mockSiblingGoal);

    await expect(
      cancelGoal({
        store,
        accountId: mockAccount.id,
        goalId: mockSiblingGoal.id,
      })
    ).rejects.toThrow(GoalNotActiveError);
    expect(await store.getActiveGoal(mockSiblingAccount.id)).toEqual(
      mockSiblingGoal
    );
  });
});
