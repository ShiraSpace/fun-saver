import { readFileSync, writeFileSync } from 'node:fs';
import { JsonFileStore } from '../index';
import type { StoreContents } from '../../data-store';
import { GOAL_ENDING } from '@/lib/goal/constants';
import { GoalAlreadyActiveError } from '@/lib/goal/errors';
import {
  mockAccount,
  mockSiblingAccount,
} from '@/test-utils/mocks/account.mocks';
import { createMockGoal, mockGoal } from '@/test-utils/mocks/goal.mocks';
import { createMockWithdrawal } from '@/test-utils/mocks/transaction.mocks';
import { createMockWallet } from '@/test-utils/mocks/wallet.mocks';
import { withTempStoreFile } from '@/test-utils/test-utils';

function storedContents(storePath: string): StoreContents {
  return JSON.parse(readFileSync(storePath, 'utf8'));
}

describe('JsonFileStore goals', () => {
  const file = withTempStoreFile();

  describe('with an active goal', () => {
    let store: JsonFileStore;

    beforeEach(async () => {
      store = new JsonFileStore(file.path);
      await store.insertGoal(mockGoal);
    });

    it('refuses a second active goal for the same account', async () => {
      await expect(
        store.insertGoal(createMockGoal({ id: 'g2' }))
      ).rejects.toThrow(GoalAlreadyActiveError);
    });

    describe('ending the goal', () => {
      const mockCancelledAt = '2026-02-01T00:00:00.000Z';

      it('ends nothing when another account asks to end the goal', async () => {
        const endedGoal = await store.endGoal({
          goalId: mockGoal.id,
          accountId: mockSiblingAccount.id,
          endedAt: mockCancelledAt,
          ending: GOAL_ENDING.cancelled,
        });

        expect(endedGoal).toBeUndefined();
        expect(await store.getActiveGoal(mockAccount.id)).toEqual(mockGoal);
      });

      it('ends nothing when the goal has already ended', async () => {
        await store.endGoal({
          goalId: mockGoal.id,
          accountId: mockAccount.id,
          endedAt: mockCancelledAt,
          ending: GOAL_ENDING.cancelled,
        });

        const endedAgain = await store.endGoal({
          goalId: mockGoal.id,
          accountId: mockAccount.id,
          endedAt: '2026-03-01T00:00:00.000Z',
          ending: GOAL_ENDING.completed,
        });

        expect(endedAgain).toBeUndefined();
      });

      describe('a withdrawal completing a goal already cancelled', () => {
        let wroteWithdrawal: boolean;

        beforeEach(async () => {
          await store.endGoal({
            goalId: mockGoal.id,
            accountId: mockAccount.id,
            endedAt: mockCancelledAt,
            ending: GOAL_ENDING.cancelled,
          });
          wroteWithdrawal = await store.insertWithdrawalCompletingGoal(
            createMockWithdrawal(createMockWallet()),
            mockGoal.id
          );
        });

        it('records nothing', () => {
          expect(storedContents(file.path).transactions).toEqual([]);
        });

        it('answers that it wrote nothing', () => {
          expect(wroteWithdrawal).toBe(false);
        });

        it('leaves the goal cancelled', () => {
          expect(storedContents(file.path).goals).toEqual([
            {
              ...mockGoal,
              endedAt: mockCancelledAt,
              ending: GOAL_ENDING.cancelled,
            },
          ]);
        });
      });
    });
  });

  it('reads a file written before goals existed as having no goal', async () => {
    writeFileSync(
      file.path,
      JSON.stringify({ accounts: [mockAccount] }),
      'utf8'
    );

    const store = new JsonFileStore(file.path);

    expect(await store.getActiveGoal(mockAccount.id)).toBeUndefined();
  });
});
