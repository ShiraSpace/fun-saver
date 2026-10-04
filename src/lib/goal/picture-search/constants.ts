export const OLDEST_SUPPORTED_ANDROID_EMOJI_VERSION = 13.0;

export const HAIR_AND_GENDER_CODE_POINTS = /[\u{1F9B0}-\u{1F9B3}\u2640\u2642]/u;

export const MAN_OR_WOMAN_SEQUENCE = /^[\u{1F468}\u{1F469}]\u200D/u;

export const VARIATION_SELECTOR = /\uFE0F/g;

export const PICTURE_WORDS_PATH =
  'src/lib/goal/picture-search/picture-words.he.json';

export const MAX_PICTURE_WORDS_BYTES = 150 * 1024;

export const PREFIX_LETTERS = 'הובלמשכ';

export const MAX_PREFIX_LETTERS = 2;

export const MIN_LETTERS_AFTER_PREFIX = 2;

export const NIQQUD = /[\u0591-\u05BD\u05BF-\u05C7]/g;

export const WORD_SEPARATORS = /[-\s\u05BE]+/;

export const PHRASE_WORD_SEPARATOR = ' ';

export const APOSTROPHES = /['’]/g;

export const GERESH = '׳';

export const QUOTATION_MARKS = /["“”]/g;

export const GERSHAYIM = '״';

export const WORD_EDGE_PUNCTUATION = /^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu;
