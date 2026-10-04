import { ValidationError } from '@/lib/errors';
import { MAX_GOAL_NAME_LENGTH, MAX_GOAL_SHEKELS } from '../constants';
import { assertValidGoalRequest } from '../goal-request-validator';
import { createMockGoalPicture } from '@/test-utils/mocks/goal.mocks';

describe('assertValidGoalRequest', () => {
  const mockGoalBody = {
    name: 'אופניים',
    amount: 300,
    picture: createMockGoalPicture('🚲'),
  };

  it('accepts a well formed body whose name is padded with spaces', () => {
    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, name: '  אופניים  ' })
    ).not.toThrow();
  });

  it('refuses a name past the length cap once it is trimmed', () => {
    const mockName = ` ${'א'.repeat(MAX_GOAL_NAME_LENGTH + 1)} `;

    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, name: mockName })
    ).toThrow(ValidationError);
  });

  it('refuses a picture that is an emoji followed by text', () => {
    const mockPicture = createMockGoalPicture('🚲abc');

    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, picture: mockPicture })
    ).toThrow(ValidationError);
  });

  it('refuses a name that is only spaces', () => {
    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, name: '   ' })
    ).toThrow(ValidationError);
  });

  it('accepts a one letter name', () => {
    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, name: 'א' })
    ).not.toThrow();
  });

  it('accepts a name exactly at the length cap once it is trimmed', () => {
    const mockName = 'א'.repeat(MAX_GOAL_NAME_LENGTH);

    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, name: `  ${mockName}  ` })
    ).not.toThrow();
  });

  it('refuses an amount of zero shekels', () => {
    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, amount: 0 })
    ).toThrow(ValidationError);
  });

  it('accepts an amount of one shekel', () => {
    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, amount: 1 })
    ).not.toThrow();
  });

  it('accepts an amount exactly at the cap', () => {
    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, amount: MAX_GOAL_SHEKELS })
    ).not.toThrow();
  });

  it('refuses an amount one shekel past the cap', () => {
    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, amount: MAX_GOAL_SHEKELS + 1 })
    ).toThrow(ValidationError);
  });

  it('refuses an amount that is not whole shekels', () => {
    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, amount: 300.5 })
    ).toThrow(ValidationError);
  });

  it('refuses a body with a field a goal does not have', () => {
    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, accountId: 'a1' })
    ).toThrow(ValidationError);
  });

  it('refuses a picture with a field a picture does not have', () => {
    const mockPicture = { ...mockGoalBody.picture, color: 'red' };

    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, picture: mockPicture })
    ).toThrow(ValidationError);
  });

  it('refuses a picture that is a word', () => {
    const mockPicture = createMockGoalPicture('bike');

    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, picture: mockPicture })
    ).toThrow(ValidationError);
  });

  it('refuses a picture that is two emoji', () => {
    const mockPicture = createMockGoalPicture('🚲🚲');

    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, picture: mockPicture })
    ).toThrow(ValidationError);
  });

  it('accepts a picture that is a flag', () => {
    const mockPicture = createMockGoalPicture('🇮🇱');

    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, picture: mockPicture })
    ).not.toThrow();
  });

  it('refuses a heart drawn as text, without its emoji variation selector', () => {
    const mockPicture = createMockGoalPicture('❤');

    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, picture: mockPicture })
    ).toThrow(ValidationError);
  });

  it('accepts a heart drawn as an emoji, with its variation selector', () => {
    const mockPicture = createMockGoalPicture('❤️');

    expect(() =>
      assertValidGoalRequest({ ...mockGoalBody, picture: mockPicture })
    ).not.toThrow();
  });

  it('refuses a body that is not an object', () => {
    expect(() => assertValidGoalRequest('אופניים')).toThrow(ValidationError);
  });

  it('refuses an array even when it carries a goal’s fields', () => {
    expect(() =>
      assertValidGoalRequest(Object.assign([], mockGoalBody))
    ).toThrow(ValidationError);
  });
});
