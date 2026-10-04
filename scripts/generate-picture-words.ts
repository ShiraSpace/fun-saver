import { writeFileSync } from 'node:fs';
import unicodeHebrewWords from 'cldr-annotations-full/annotations/he/annotations.json';
import unicodeHebrewCombinedWords from 'cldr-annotations-derived-full/annotationsDerived/he/annotations.json';
import unicodeEmoji from 'unicode-emoji-json/data-by-emoji.json';
import { isValidPictureEmoji } from '@/lib/goal/goal-request-validator';
import {
  MAX_PICTURE_WORDS_BYTES,
  PICTURE_WORDS_PATH,
} from '@/lib/goal/picture-search/constants';
import { searchablePictureWords } from '@/lib/goal/picture-search/searchable-picture-words';
import type { PictureWords } from '@/lib/goal/picture-search/types';

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

function generatePictureWords(): void {
  const pictureWords = searchablePictureWords(unicodeEmoji, {
    ...unicodeHebrewWords.annotations.annotations,
    ...unicodeHebrewCombinedWords.annotationsDerived.annotations,
  });
  assertEveryPictureIsAGoalPicture(pictureWords);
  savePictureWords(pictureWords);
}

generatePictureWords();
