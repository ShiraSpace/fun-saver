import { asObject, hasOnlyFields } from '@/lib/json-object';
import { isNameWithin } from '@/lib/name';
import {
  GOAL_PICTURE_KIND,
  MAX_GOAL_NAME_LENGTH,
  MAX_GOAL_SHEKELS,
  MAX_PICTURE_EMOJI_LENGTH,
} from './constants';
import type { GoalPicture } from './types';

export interface GoalInput {
  name: string;
  amountShekels: number;
  picture: GoalPicture;
}

const GOAL_FIELDS: readonly string[] = ['name', 'amount', 'picture'];

const PICTURE_FIELDS: readonly string[] = ['kind', 'emoji'];

const SINGLE_EMOJI = new RegExp('^\\p{RGI_Emoji}$', 'v');

export function isPictureEmoji(emoji: unknown): emoji is string {
  return (
    typeof emoji === 'string' &&
    emoji.length <= MAX_PICTURE_EMOJI_LENGTH &&
    SINGLE_EMOJI.test(emoji)
  );
}

function isValidAmountShekels(amountShekels: unknown): amountShekels is number {
  return (
    typeof amountShekels === 'number' &&
    Number.isInteger(amountShekels) &&
    amountShekels >= 1 &&
    amountShekels <= MAX_GOAL_SHEKELS
  );
}

function validPicture(body: unknown): GoalPicture | undefined {
  const requested = asObject(body);

  if (
    !requested ||
    !hasOnlyFields(requested, PICTURE_FIELDS) ||
    requested.kind !== GOAL_PICTURE_KIND.emoji ||
    !isPictureEmoji(requested.emoji)
  ) {
    return;
  }

  return { kind: GOAL_PICTURE_KIND.emoji, emoji: requested.emoji };
}

export function validGoal(body: unknown): GoalInput | undefined {
  const requested = asObject(body);

  if (!requested || !hasOnlyFields(requested, GOAL_FIELDS)) {
    return;
  }

  const { name, amount: amountShekels } = requested;
  const picture = validPicture(requested.picture);

  if (
    !isNameWithin(name, MAX_GOAL_NAME_LENGTH) ||
    !isValidAmountShekels(amountShekels) ||
    !picture
  ) {
    return;
  }

  return { name: name.trim(), amountShekels, picture };
}
