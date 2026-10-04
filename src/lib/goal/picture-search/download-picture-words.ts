import { writeFileSync } from 'node:fs';
import unicodeHebrewWords from 'cldr-annotations-full/annotations/he/annotations.json';
import unicodeHebrewCombinedWords from 'cldr-annotations-derived-full/annotationsDerived/he/annotations.json';
import unicodeEmoji from 'unicode-emoji-json/data-by-emoji.json';
import { isValidPictureEmoji } from '@/lib/goal/goal-request-validator';
import {
  HAIR_AND_GENDER_CODE_POINTS,
  MAX_PICTURE_WORDS_BYTES,
  OLDEST_SUPPORTED_ANDROID_EMOJI_VERSION,
  PICTURE_WORDS_PATH,
  VARIATION_SELECTOR,
} from './constants';
import type { PictureWords } from './types';

interface UnicodeWords {
  default?: string[];
  tts?: string[];
}

const unicodeWordsByEmoji: Record<string, UnicodeWords> = {
  ...unicodeHebrewWords.annotations.annotations,
  ...unicodeHebrewCombinedWords.annotationsDerived.annotations,
};

function isDrawnOnOldestSupportedPhone(emojiVersion: string): boolean {
  return Number(emojiVersion) <= OLDEST_SUPPORTED_ANDROID_EMOJI_VERSION;
}

function isVariantOfAnotherPicture(picture: string): boolean {
  return HAIR_AND_GENDER_CODE_POINTS.test(picture);
}

function goalPictures(): string[] {
  return Object.entries(unicodeEmoji)
    .filter(
      ([picture, { emoji_version: emojiVersion }]) =>
        isDrawnOnOldestSupportedPhone(emojiVersion) &&
        !isVariantOfAnotherPicture(picture)
    )
    .map(([picture]) => picture);
}

function hebrewWords(picture: string): string[] {
  const { default: keywords = [], tts: spokenName = [] } =
    unicodeWordsByEmoji[picture.replace(VARIATION_SELECTOR, '')] ?? {};
  return [...new Set([...keywords, ...spokenName])];
}

function searchablePictureWords(): PictureWords {
  const pictureWords: PictureWords = {};
  for (const picture of goalPictures()) {
    const words = hebrewWords(picture);

    if (words.length > 0) {
      pictureWords[picture] = words;
    }
  }
  return pictureWords;
}

function assertEveryPictureIsAGoalPicture(pictureWords: PictureWords): void {
  const invalidPictures = Object.keys(pictureWords).filter(
    (picture) => !isValidPictureEmoji(picture)
  );

  if (invalidPictures.length > 0) {
    throw new Error(`Not a goal picture: ${invalidPictures.join()}`);
  }
}

function savePictureWords(pictureWords: PictureWords): void {
  const savedText = `${JSON.stringify(pictureWords)}\n`;
  const bytes = Buffer.byteLength(savedText);

  if (bytes > MAX_PICTURE_WORDS_BYTES) {
    throw new Error(
      `${PICTURE_WORDS_PATH} is ${bytes} bytes, over ${MAX_PICTURE_WORDS_BYTES}`
    );
  }
  writeFileSync(PICTURE_WORDS_PATH, savedText);
  console.log(
    `${PICTURE_WORDS_PATH}: ${Object.keys(pictureWords).length} pictures, ${bytes} bytes`
  );
}

function downloadPictureWords(): void {
  const pictureWords = searchablePictureWords();
  assertEveryPictureIsAGoalPicture(pictureWords);
  savePictureWords(pictureWords);
}

downloadPictureWords();
