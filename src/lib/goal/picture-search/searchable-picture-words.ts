import {
  HAIR_AND_GENDER_CODE_POINTS,
  OLDEST_SUPPORTED_ANDROID_EMOJI_VERSION,
  VARIATION_SELECTOR,
} from './constants';
import type { PictureWords, UnicodeEmoji, UnicodeWords } from './types';

function isDrawnOnOldestSupportedPhone(emojiVersion: string): boolean {
  return Number(emojiVersion) <= OLDEST_SUPPORTED_ANDROID_EMOJI_VERSION;
}

function isVariantOfAnotherPicture(picture: string): boolean {
  return HAIR_AND_GENDER_CODE_POINTS.test(picture);
}

function goalPictures(unicodeEmoji: UnicodeEmoji): string[] {
  return Object.entries(unicodeEmoji)
    .filter(
      ([picture, { emoji_version: emojiVersion }]) =>
        isDrawnOnOldestSupportedPhone(emojiVersion) &&
        !isVariantOfAnotherPicture(picture)
    )
    .map(([picture]) => picture);
}

function hebrewWords(
  picture: string,
  unicodeWordsByEmoji: Record<string, UnicodeWords>
): string[] {
  const { default: keywords = [], tts: spokenName = [] } =
    unicodeWordsByEmoji[picture.replace(VARIATION_SELECTOR, '')] ?? {};
  return [...new Set([...keywords, ...spokenName])];
}

export function searchablePictureWords(
  unicodeEmoji: UnicodeEmoji,
  unicodeWordsByEmoji: Record<string, UnicodeWords>
): PictureWords {
  const pictureWords: PictureWords = {};
  for (const picture of goalPictures(unicodeEmoji)) {
    const words = hebrewWords(picture, unicodeWordsByEmoji);

    if (words.length > 0) {
      pictureWords[picture] = words;
    }
  }
  return pictureWords;
}
