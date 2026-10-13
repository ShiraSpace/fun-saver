import { ValidationError } from '@/lib/errors';
import { asObject, hasOnlyFields } from '@/lib/json-object';
import { isNameWithin } from '@/lib/name';
import {
  GOAL_PICTURE_KIND,
  MAX_GOAL_NAME_LENGTH,
  MAX_GOAL_SHEKELS,
  MAX_PICTURE_EMOJI_LENGTH,
} from './constants';
import type { GoalRequest } from './types';

const GOAL_FIELDS = ['name', 'amount', 'picture'] as const;

const PICTURE_FIELDS = ['kind', 'emoji'] as const;

const SINGLE_EMOJI = new RegExp('^\\p{RGI_Emoji}$', 'v');

export function isValidPictureEmoji(emoji: unknown): emoji is string {
  return (
    typeof emoji === 'string' &&
    emoji.length <= MAX_PICTURE_EMOJI_LENGTH &&
    SINGLE_EMOJI.test(emoji)
  );
}

export function isValidGoalName(name: unknown): boolean {
  return isNameWithin(name, MAX_GOAL_NAME_LENGTH);
}

export function isGoalAmountMissing(amountShekels: number): boolean {
  return amountShekels < 1;
}

export function isGoalAmountTooHigh(amountShekels: number): boolean {
  return amountShekels > MAX_GOAL_SHEKELS;
}

function isValidAmountShekels({ amount }: Record<string, unknown>): boolean {
  return (
    typeof amount === 'number' &&
    Number.isInteger(amount) &&
    !isGoalAmountMissing(amount) &&
    !isGoalAmountTooHigh(amount)
  );
}

function isValidPicture({ picture }: Record<string, unknown>): boolean {
  const requested = asObject(picture);

  return (
    requested !== undefined &&
    hasOnlyFields(requested, PICTURE_FIELDS) &&
    requested.kind === GOAL_PICTURE_KIND.emoji &&
    isValidPictureEmoji(requested.emoji)
  );
}

function isGoalRequest(body: unknown): body is GoalRequest {
  const requested = asObject(body);

  return (
    requested !== undefined &&
    hasOnlyFields(requested, GOAL_FIELDS) &&
    isValidGoalName(requested.name) &&
    isValidAmountShekels(requested) &&
    isValidPicture(requested)
  );
}

export function assertValidGoalRequest(body: unknown): asserts body is GoalRequest {
  if (!isGoalRequest(body)) {
    throw new ValidationError('invalid goal');
  }
}
