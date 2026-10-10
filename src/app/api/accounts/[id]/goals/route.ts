import { StatusCodes } from 'http-status-codes';
import { getStore } from '@/db';
import { ValidationError } from '@/lib/errors';
import { GoalAlreadyActiveError } from '@/lib/goal/errors';
import { setGoal } from '@/lib/goal/goals';
import { jsonBody } from '@/app/api/json-body';
import { API_ERRORS } from '@/app/api/constants';
import { badRequest, conflict } from '@/app/api/responses';
import { withAccountEditor } from '../with-account-access';

export const POST = withAccountEditor(async (request, accountId) => {
  try {
    const goal = await setGoal({
      store: getStore(),
      accountId,
      body: await jsonBody(request),
    });

    return Response.json(goal, { status: StatusCodes.CREATED });
  } catch (error) {
    if (error instanceof ValidationError) {
      return badRequest(API_ERRORS.invalidGoal);
    }

    if (error instanceof GoalAlreadyActiveError) {
      return conflict(API_ERRORS.goalAlreadyActive);
    }

    throw error;
  }
});
