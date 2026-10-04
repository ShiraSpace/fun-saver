const CLDR_JSON_RELEASE =
  'https://raw.githubusercontent.com/unicode-org/cldr-json/48.2.0/cldr-json';

export const CLDR_ANNOTATIONS_URL = `${CLDR_JSON_RELEASE}/cldr-annotations-full/annotations/he/annotations.json`;

export const CLDR_DERIVED_ANNOTATIONS_URL = `${CLDR_JSON_RELEASE}/cldr-annotations-derived-full/annotationsDerived/he/annotations.json`;

export const EMOJI_TEST_URL =
  'https://www.unicode.org/Public/17.0.0/emoji/emoji-test.txt';

export const OLDEST_SUPPORTED_ANDROID_EMOJI_VERSION = 13.0;

export const MAX_OUTPUT_BYTES = 150 * 1024;

export const FULLY_QUALIFIED_LINE =
  /^([0-9A-F ]+?)\s*;\s*fully-qualified\s*#\s*\S+\s+E(\d+\.\d+)/;

export const SKIN_TONE_HAIR_AND_GENDER_CODE_POINTS =
  /[\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}\u2640\u2642]/u;

export const VARIATION_SELECTOR = /\uFE0F/g;

export const OUTPUT_PATH = 'src/lib/goal/emoji-words.he.json';

export const CODE_POINT_SEPARATOR = ' ';

export const HEX_RADIX = 16;

export const LINE_BREAK = '\n';

export const PICTURE_LIST_SEPARATOR = ' ';
