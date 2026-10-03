export const GOAL_ENDING = {
  completed: 'completed',
  cancelled: 'cancelled',
} as const;

export const GOAL_PICTURE_KIND = {
  emoji: 'emoji',
} as const;

export const MAX_GOAL_NAME_LENGTH = 30;

export const MAX_GOAL_SHEKELS = 100_000;

export const MAX_PICTURE_EMOJI_LENGTH = 32;

export const PREFIX_LETTERS = 'הובלמשכ';

export const MAX_PREFIX_LETTERS = 2;

export const MIN_LETTERS_AFTER_PREFIX = 2;

export const NIQQUD = /[\u0591-\u05BD\u05BF-\u05C7]/g;

export const WORD_SEPARATORS = /[-\s\u05BE]+/;

export const PHRASE_WORD_SEPARATOR = ' ';

export const APOSTROPHES = /['’]/g;

export const GERESH = '׳';
