import { StatusCodes } from 'http-status-codes';
import type { GoalRequest } from '@/lib/goal/types';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { sessionCookie } from './auth-session';
import type { RunningServer } from '../server';

export class AnotherPhoneDriver {
  constructor(private readonly server: () => RunningServer) {}

  async setGoal(accountId: string, goalRequest: GoalRequest): Promise<void> {
    const { baseUrl, authSecret } = this.server();
    const cookie = await sessionCookie(mockUser, authSecret);
    const response = await fetch(`${baseUrl}/api/accounts/${accountId}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${cookie.name}=${cookie.value}`,
      },
      body: JSON.stringify(goalRequest),
    });

    if (response.status !== StatusCodes.CREATED) {
      throw new Error(`setting a goal answered ${response.status}`);
    }
  }
}
