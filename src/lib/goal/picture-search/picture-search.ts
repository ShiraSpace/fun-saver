import {
  APOSTROPHES,
  GERESH,
  GERSHAYIM,
  MAX_PREFIX_LETTERS,
  MIN_LETTERS_AFTER_PREFIX,
  NIQQUD,
  PHRASE_WORD_SEPARATOR,
  PREFIX_LETTERS,
  QUOTATION_MARKS,
  WORD_EDGE_PUNCTUATION,
  WORD_SEPARATORS,
} from './constants';
import type { PicturesByTerm, PictureWords } from './types';

function wordsIn(text: string): string[] {
  return text
    .replace(NIQQUD, '')
    .replace(APOSTROPHES, GERESH)
    .replace(QUOTATION_MARKS, GERSHAYIM)
    .split(WORD_SEPARATORS)
    .map((word) => word.replace(WORD_EDGE_PUNCTUATION, ''))
    .filter(Boolean);
}

function searchTerms(text: string): string[] {
  const words = wordsIn(text);
  return words.length > 1
    ? [words.join(PHRASE_WORD_SEPARATOR), ...words]
    : words;
}

export function indexPictureWords(pictureWords: PictureWords): PicturesByTerm {
  const picturesByTerm: PicturesByTerm = new Map();
  for (const [picture, words] of Object.entries(pictureWords)) {
    for (const term of words.flatMap(searchTerms)) {
      picturesByTerm.set(
        term,
        (picturesByTerm.get(term) ?? new Set()).add(picture)
      );
    }
  }
  return picturesByTerm;
}

function restsWithoutPrefix(typedWord: string, prefixLength: number): string[] {
  const prefix = typedWord.slice(0, prefixLength);
  const rest = typedWord.slice(prefixLength);
  const isPrefix = [...prefix].every((letter) =>
    PREFIX_LETTERS.includes(letter)
  );
  return isPrefix && rest.length >= MIN_LETTERS_AFTER_PREFIX ? [rest] : [];
}

function wordsToLookUp(typedWord: string): string[] {
  const prefixLengths = Array.from(
    { length: MAX_PREFIX_LETTERS },
    (_, index) => index + 1
  );
  return [
    typedWord,
    ...prefixLengths.flatMap((prefixLength) =>
      restsWithoutPrefix(typedWord, prefixLength)
    ),
  ];
}

function picturesForWord(
  typedWord: string,
  picturesByTerm: PicturesByTerm
): Map<string, number> {
  const lookups = wordsToLookUp(typedWord);
  const scoreByPicture = new Map<string, number>();

  lookups.forEach((word, strippedLetters) => {
    for (const picture of picturesByTerm.get(word) ?? []) {
      if (!scoreByPicture.has(picture)) {
        scoreByPicture.set(picture, MAX_PREFIX_LETTERS + 1 - strippedLetters);
      }
    }
  });
  return scoreByPicture;
}

function rankedPictures(scoreByPicture: Map<string, number>): string[] {
  return [...scoreByPicture.entries()]
    .sort(([, firstScore], [, secondScore]) => secondScore - firstScore)
    .map(([picture]) => picture);
}

export function matchingPictures(
  query: string,
  picturesByTerm: PicturesByTerm
): string[] {
  const scoreByPicture = new Map<string, number>();
  for (const term of searchTerms(query)) {
    for (const [picture, score] of picturesForWord(term, picturesByTerm)) {
      scoreByPicture.set(picture, (scoreByPicture.get(picture) ?? 0) + score);
    }
  }
  return rankedPictures(scoreByPicture);
}
