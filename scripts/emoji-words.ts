import { writeFileSync } from 'node:fs';
import {
  CLDR_ANNOTATIONS_URL,
  CODE_POINT_SEPARATOR,
  CLDR_DERIVED_ANNOTATIONS_URL,
  EMOJI_TEST_URL,
  FULLY_QUALIFIED_LINE,
  HEX_RADIX,
  LINE_BREAK,
  MAX_OUTPUT_BYTES,
  OLDEST_SUPPORTED_ANDROID_EMOJI_VERSION,
  OUTPUT_PATH,
  PICTURE_LIST_SEPARATOR,
  SKIN_TONE_HAIR_AND_GENDER_CODE_POINTS,
  VARIATION_SELECTOR,
} from './constants';
import { isValidPictureEmoji } from '@/lib/goal/goal-request-validator';
import type { PictureWords } from '@/lib/goal/types';

interface CldrAnnotation {
  default?: string[];
  tts?: string[];
}

type CldrAnnotations = Record<string, CldrAnnotation>;

interface CldrAnnotationsFile {
  annotations?: { annotations?: CldrAnnotations };
}

interface CldrDerivedAnnotationsFile {
  annotationsDerived?: { annotations?: CldrAnnotations };
}

interface FullyQualifiedEmoji {
  emoji: string;
  version: number;
}

async function download(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} answered ${response.status}`);
  }
  return response.text();
}

async function downloadJson<T>(url: string): Promise<T> {
  return JSON.parse(await download(url)) as T;
}

function withoutVariationSelector(emoji: string): string {
  return emoji.replace(VARIATION_SELECTOR, '');
}

function emojiFromCodePoints(codePoints: string): string {
  return String.fromCodePoint(
    ...codePoints
      .split(CODE_POINT_SEPARATOR)
      .map((codePoint) => parseInt(codePoint, HEX_RADIX))
  );
}

function fullyQualifiedEmojiByCldrKey(
  emojiTest: string
): Map<string, FullyQualifiedEmoji> {
  const emojiByCldrKey = new Map<string, FullyQualifiedEmoji>();
  for (const line of emojiTest.split(LINE_BREAK)) {
    const match = FULLY_QUALIFIED_LINE.exec(line);
    if (match) {
      const emoji = emojiFromCodePoints(match[1]);
      emojiByCldrKey.set(withoutVariationSelector(emoji), {
        emoji,
        version: Number(match[2]),
      });
    }
  }
  return emojiByCldrKey;
}

function isSupportedPicture({ emoji, version }: FullyQualifiedEmoji): boolean {
  return (
    version <= OLDEST_SUPPORTED_ANDROID_EMOJI_VERSION &&
    !SKIN_TONE_HAIR_AND_GENDER_CODE_POINTS.test(emoji)
  );
}

function hebrewWords(annotation: CldrAnnotation): string[] {
  return [
    ...new Set([...(annotation.default ?? []), ...(annotation.tts ?? [])]),
  ];
}

function pictureWords(
  annotations: CldrAnnotations,
  emojiByCldrKey: Map<string, FullyQualifiedEmoji>
): PictureWords {
  const words: PictureWords = {};
  for (const [cldrKey, annotation] of Object.entries(annotations)) {
    const fullyQualified = emojiByCldrKey.get(
      withoutVariationSelector(cldrKey)
    );
    if (fullyQualified && isSupportedPicture(fullyQualified)) {
      words[fullyQualified.emoji] = hebrewWords(annotation);
    }
  }
  return words;
}

function assertAllGoalPictures(words: PictureWords): void {
  const invalidPictures = Object.keys(words).filter(
    (picture) => !isValidPictureEmoji(picture)
  );
  if (invalidPictures.length > 0) {
    throw new Error(
      `Not a goal picture: ${invalidPictures.join(PICTURE_LIST_SEPARATOR)}`
    );
  }
}

function serializedPictureWords(words: PictureWords): string {
  const serialized = JSON.stringify(words);
  const bytes = Buffer.byteLength(serialized);
  if (bytes > MAX_OUTPUT_BYTES) {
    throw new Error(
      `${OUTPUT_PATH} is ${bytes} bytes, over ${MAX_OUTPUT_BYTES}`
    );
  }
  return serialized;
}

function requiredAnnotations(
  url: string,
  annotations: CldrAnnotations | undefined
): CldrAnnotations {
  if (!annotations || Object.keys(annotations).length === 0) {
    throw new Error(`${url} has no annotations`);
  }
  return annotations;
}

async function cldrAnnotations(): Promise<CldrAnnotations> {
  const [annotationsFile, derivedFile] = await Promise.all([
    downloadJson<CldrAnnotationsFile>(CLDR_ANNOTATIONS_URL),
    downloadJson<CldrDerivedAnnotationsFile>(CLDR_DERIVED_ANNOTATIONS_URL),
  ]);
  return {
    ...requiredAnnotations(
      CLDR_ANNOTATIONS_URL,
      annotationsFile.annotations?.annotations
    ),
    ...requiredAnnotations(
      CLDR_DERIVED_ANNOTATIONS_URL,
      derivedFile.annotationsDerived?.annotations
    ),
  };
}

async function writePictureWords(): Promise<void> {
  const [annotations, emojiTest] = await Promise.all([
    cldrAnnotations(),
    download(EMOJI_TEST_URL),
  ]);
  const words = pictureWords(
    annotations,
    fullyQualifiedEmojiByCldrKey(emojiTest)
  );
  assertAllGoalPictures(words);
  const serialized = serializedPictureWords(words);
  writeFileSync(OUTPUT_PATH, `${serialized}${LINE_BREAK}`);
  console.log(
    `${OUTPUT_PATH}: ${Object.keys(words).length} pictures, ${serialized.length} characters`
  );
}

writePictureWords().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
