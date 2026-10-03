import type { Goal, GoalEndRequest } from '@/lib/goal/types';
import { GoalAlreadyActiveError } from '@/lib/goal/errors';
import type { Transaction } from '@/lib/transaction/types';
import type { GoalRepository } from '../data-store';
import { endActiveGoal, findActiveGoal, goalCompletedBy } from '../goals';
import type { MemoryTransactions } from './transactions';

export class MemoryGoals implements GoalRepository {
  private readonly goals: Goal[] = [];

  constructor(private readonly transactions: MemoryTransactions) {}

  async insert(goal: Goal): Promise<void> {
    if (findActiveGoal(this.goals, goal.accountId)) {
      throw new GoalAlreadyActiveError(goal.accountId);
    }

    this.goals.push(goal);
  }

  async getActive(accountId: string): Promise<Goal | undefined> {
    return findActiveGoal(this.goals, accountId);
  }

  async end(endRequest: GoalEndRequest): Promise<Goal | undefined> {
    return endActiveGoal(this.goals, endRequest);
  }

  async insertWithdrawalCompleting(
    withdrawal: Transaction,
    goalId: string
  ): Promise<void> {
    endActiveGoal(this.goals, goalCompletedBy(withdrawal, goalId));
    await this.transactions.insert([withdrawal]);
  }
}
