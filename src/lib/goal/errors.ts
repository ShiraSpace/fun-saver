export class SavingsLockedError extends Error {
  constructor() {
    super('savings are kept until the goal is reached');
  }
}

export class GoalAlreadyActiveError extends Error {
  constructor(accountId: string) {
    super(`account ${accountId} already has an active goal`);
  }
}

export class GoalNotActiveError extends Error {
  constructor(goalId: string) {
    super(`goal ${goalId} is not an active goal of this account`);
  }
}
