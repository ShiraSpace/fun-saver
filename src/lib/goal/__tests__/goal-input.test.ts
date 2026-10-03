import {
  GOAL_PICTURE_KIND,
  MAX_GOAL_NAME_LENGTH,
  MAX_GOAL_SHEKELS,
} from '../constants';
import { validGoal } from '../goal-input';

describe('validGoal', () => {
  const mockGoalBody = {
    name: 'אופניים',
    amount: 300,
    picture: { kind: GOAL_PICTURE_KIND.emoji, emoji: '🚲' },
  };

  it('returns the trimmed name, the amount in shekels and the picture from a well formed body', () => {
    expect(validGoal({ ...mockGoalBody, name: '  אופניים  ' })).toEqual({
      name: 'אופניים',
      amountShekels: 300,
      picture: { kind: GOAL_PICTURE_KIND.emoji, emoji: '🚲' },
    });
  });

  it('refuses a name past the length cap once it is trimmed', () => {
    const mockName = ` ${'א'.repeat(MAX_GOAL_NAME_LENGTH + 1)} `;

    expect(validGoal({ ...mockGoalBody, name: mockName })).toBeUndefined();
  });

  it('refuses a picture that is an emoji followed by text', () => {
    const mockPicture = { kind: GOAL_PICTURE_KIND.emoji, emoji: '🚲abc' };

    expect(
      validGoal({ ...mockGoalBody, picture: mockPicture })
    ).toBeUndefined();
  });

  it('refuses a name that is only spaces', () => {
    expect(validGoal({ ...mockGoalBody, name: '   ' })).toBeUndefined();
  });

  it('returns a one letter name', () => {
    expect(validGoal({ ...mockGoalBody, name: 'א' })?.name).toBe('א');
  });

  it('returns a name exactly at the length cap once it is trimmed', () => {
    const mockName = 'א'.repeat(MAX_GOAL_NAME_LENGTH);

    expect(validGoal({ ...mockGoalBody, name: `  ${mockName}  ` })?.name).toBe(
      mockName
    );
  });

  it('refuses an amount of zero shekels', () => {
    expect(validGoal({ ...mockGoalBody, amount: 0 })).toBeUndefined();
  });

  it('returns an amount of one shekel', () => {
    expect(validGoal({ ...mockGoalBody, amount: 1 })?.amountShekels).toBe(1);
  });

  it('returns an amount exactly at the cap', () => {
    expect(
      validGoal({ ...mockGoalBody, amount: MAX_GOAL_SHEKELS })?.amountShekels
    ).toBe(MAX_GOAL_SHEKELS);
  });

  it('refuses an amount one shekel past the cap', () => {
    expect(
      validGoal({ ...mockGoalBody, amount: MAX_GOAL_SHEKELS + 1 })
    ).toBeUndefined();
  });

  it('refuses an amount that is not whole shekels', () => {
    expect(validGoal({ ...mockGoalBody, amount: 300.5 })).toBeUndefined();
  });

  it('refuses a body with a field a goal does not have', () => {
    expect(validGoal({ ...mockGoalBody, accountId: 'a1' })).toBeUndefined();
  });

  it('refuses a picture with a field a picture does not have', () => {
    const mockPicture = { ...mockGoalBody.picture, color: 'red' };

    expect(
      validGoal({ ...mockGoalBody, picture: mockPicture })
    ).toBeUndefined();
  });

  it('refuses a picture that is a word', () => {
    const mockPicture = { kind: GOAL_PICTURE_KIND.emoji, emoji: 'bike' };

    expect(
      validGoal({ ...mockGoalBody, picture: mockPicture })
    ).toBeUndefined();
  });

  it('refuses a picture that is two emoji', () => {
    const mockPicture = { kind: GOAL_PICTURE_KIND.emoji, emoji: '🚲🚲' };

    expect(
      validGoal({ ...mockGoalBody, picture: mockPicture })
    ).toBeUndefined();
  });

  it('returns a picture that is a flag', () => {
    const mockPicture = { kind: GOAL_PICTURE_KIND.emoji, emoji: '🇮🇱' };

    expect(
      validGoal({ ...mockGoalBody, picture: mockPicture })?.picture
    ).toEqual(mockPicture);
  });

  it('refuses a heart drawn as text, without its emoji variation selector', () => {
    const mockPicture = { kind: GOAL_PICTURE_KIND.emoji, emoji: '❤' };

    expect(
      validGoal({ ...mockGoalBody, picture: mockPicture })
    ).toBeUndefined();
  });

  it('returns a heart drawn as an emoji, with its variation selector', () => {
    const mockPicture = { kind: GOAL_PICTURE_KIND.emoji, emoji: '❤️' };

    expect(
      validGoal({ ...mockGoalBody, picture: mockPicture })?.picture
    ).toEqual(mockPicture);
  });

  it('refuses a body that is not an object', () => {
    expect(validGoal('אופניים')).toBeUndefined();
  });

  it('refuses an array even when it carries a goal’s fields', () => {
    expect(validGoal(Object.assign([], mockGoalBody))).toBeUndefined();
  });
});
