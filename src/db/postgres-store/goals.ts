import type { Goal, GoalEndRequest } from '@/lib/goal/types';
import type { Transaction } from '@/lib/transaction/types';
import type { GoalRepository } from '../data-store';
import { completedGoalEndRequest } from '../goals';
import { goalFromRow, type GoalRow } from '../rows';
import { goalWriteError } from './errors';
import { queryRows, type QueryParam, type Sql } from './query';
import { PostgresTransactions } from './transactions';

const END_ACTIVE_GOAL = `
  UPDATE goals SET ended_at = $3, ending = $4
  WHERE id = $1 AND account_id = $2 AND ended_at IS NULL
  RETURNING *
`;

function endValues({
  goalId,
  accountId,
  endedAt,
  ending,
}: GoalEndRequest): QueryParam[] {
  return [goalId, accountId, endedAt, ending];
}

export class PostgresGoals implements GoalRepository {
  private readonly transactions: PostgresTransactions;

  constructor(private readonly sql: Sql) {
    this.transactions = new PostgresTransactions(sql);
  }

  async insert(goal: Goal): Promise<void> {
    try {
      await this.sql`
        INSERT INTO goals (id, account_id, name, amount, picture, started_at)
        VALUES (
          ${goal.id},
          ${goal.accountId},
          ${goal.name},
          ${goal.amount},
          ${JSON.stringify(goal.picture)}::jsonb,
          ${goal.startedAt}
        )
      `;
    } catch (error) {
      throw goalWriteError(error, goal.accountId);
    }
  }

  async getActive(accountId: string): Promise<Goal | undefined> {
    const rows = await queryRows<GoalRow>(
      this.sql,
      'SELECT * FROM goals WHERE account_id = $1 AND ended_at IS NULL',
      [accountId]
    );

    return rows[0] ? goalFromRow(rows[0]) : undefined;
  }

  async end(endRequest: GoalEndRequest): Promise<Goal | undefined> {
    const rows = await queryRows<GoalRow>(
      this.sql,
      END_ACTIVE_GOAL,
      endValues(endRequest)
    );

    return rows[0] ? goalFromRow(rows[0]) : undefined;
  }

  async insertWithdrawalCompleting(
    withdrawal: Transaction,
    goalId: string
  ): Promise<void> {
    await this.sql.transaction([
      this.transactions.insertStatement([withdrawal]),
      this.sql.query(
        END_ACTIVE_GOAL,
        endValues(completedGoalEndRequest(withdrawal, goalId))
      ),
    ]);
  }
}
