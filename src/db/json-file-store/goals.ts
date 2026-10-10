import type { Goal, GoalEndRequest } from '@/lib/goal/types';
import { GoalAlreadyActiveError } from '@/lib/goal/errors';
import type { Transaction } from '@/lib/transaction/types';
import type { GoalRepository } from '../data-store';
import {
  endActiveGoal,
  findActiveGoal,
  completedGoalEndRequest,
} from '../goals';
import type { FileSession } from './file-session';

export class JsonGoals implements GoalRepository {
  constructor(private readonly session: FileSession) {}

  insert(goal: Goal): Promise<void> {
    return this.session.write(async (contents, save): Promise<void> => {
      if (findActiveGoal(contents.goals, goal.accountId)) {
        throw new GoalAlreadyActiveError(goal.accountId);
      }

      contents.goals.push(goal);
      await save();
    });
  }

  getActive(accountId: string): Promise<Goal | undefined> {
    return this.session.read((contents): Goal | undefined =>
      findActiveGoal(contents.goals, accountId)
    );
  }

  end(endRequest: GoalEndRequest): Promise<Goal | undefined> {
    return this.session.write(
      async (contents, save): Promise<Goal | undefined> => {
        const endedGoal = endActiveGoal(contents.goals, endRequest);

        if (endedGoal) {
          await save();
        }

        return endedGoal;
      }
    );
  }

  insertWithdrawalCompleting(
    withdrawal: Transaction,
    goalId: string
  ): Promise<boolean> {
    return this.session.write(async (contents, save): Promise<boolean> => {
      const completedGoal = endActiveGoal(
        contents.goals,
        completedGoalEndRequest(withdrawal, goalId)
      );

      if (!completedGoal) {
        return false;
      }

      contents.transactions.push(withdrawal);
      await save();

      return true;
    });
  }
}
