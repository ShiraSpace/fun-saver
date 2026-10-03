import {
  APOSTROPHES,
  GERESH,
  MAX_PREFIX_LETTERS,
  MIN_LETTERS_AFTER_PREFIX,
  NIQQUD,
  PHRASE_WORD_SEPARATOR,
  PREFIX_LETTERS,
  WORD_SEPARATORS,
} from './constants';
import type { PictureWords } from './types';

export type PicturesByTerm = Map<string, Set<string>>;

function searchableWords(text: string): string[] {
  return text
    .replace(NIQQUD, '')
    .replace(APOSTROPHES, GERESH)
    .split(WORD_SEPARATORS)
    .filter(Boolean);
}

function annotationTerms(annotation: string): string[] {
  const words = searchableWords(annotation);
  return [words.join(PHRASE_WORD_SEPARATOR), ...words];
}

export function indexPictureWords(pictureWords: PictureWords): PicturesByTerm {
  const picturesByTerm: PicturesByTerm = new Map();
  for (const [picture, annotations] of Object.entries(pictureWords)) {
    for (const term of annotations.flatMap(annotationTerms)) {
      picturesByTerm.set(
        term,
        (picturesByTerm.get(term) ?? new Set()).add(picture)
      );
    }
  }
  return picturesByTerm;
}

function withoutPrefix(
  typedWord: string,
  prefixLength: number
): string | undefined {
  const prefix = typedWord.slice(0, prefixLength);
  const rest = typedWord.slice(prefixLength);
  const isPrefix = [...prefix].every((letter) =>
    PREFIX_LETTERS.includes(letter)
  );
  return isPrefix && rest.length >= MIN_LETTERS_AFTER_PREFIX ? rest : undefined;
}

function picturesForWord(
  typedWord: string,
  picturesByTerm: PicturesByTerm
): Set<string> {
  const exactMatch = picturesByTerm.get(typedWord);
  if (exactMatch) {
    return exactMatch;
  }
  for (
    let prefixLength = 1;
    prefixLength <= MAX_PREFIX_LETTERS;
    prefixLength++
  ) {
    const wordWithoutPrefix = withoutPrefix(typedWord, prefixLength);
    const prefixMatch =
      wordWithoutPrefix && picturesByTerm.get(wordWithoutPrefix);
    if (prefixMatch) {
      return prefixMatch;
    }
  }
  return new Set();
}

function typedTerms(query: string): string[] {
  const words = searchableWords(query);
  return words.length > 1
    ? [words.join(PHRASE_WORD_SEPARATOR), ...words]
    : words;
}

function rankedPictures(matchCountByPicture: Map<string, number>): string[] {
  return [...matchCountByPicture.entries()]
    .sort(([, firstCount], [, secondCount]) => secondCount - firstCount)
    .map(([picture]) => picture);
}

export function matchingPictures(
  query: string,
  picturesByTerm: PicturesByTerm
): string[] {
  const matchCountByPicture = new Map<string, number>();
  for (const term of typedTerms(query)) {
    for (const picture of picturesForWord(term, picturesByTerm)) {
      matchCountByPicture.set(
        picture,
        (matchCountByPicture.get(picture) ?? 0) + 1
      );
    }
  }
  return rankedPictures(matchCountByPicture);
}
