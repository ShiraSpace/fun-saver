export const PICTURE_TILES_TEST_IDS = {
  foundPictures: 'goal-picture-search-found-pictures',
  noPicturesReason: 'goal-picture-search-no-pictures-reason',
} as const;

export const PICTURE_TILES_COPY = {
  loading: 'מחפשים תמונות…',
  failedToLoad: 'אופס, התמונות לא נטענו. סגרו ונסו שוב.',
  nothingTyped: 'כתבו מה רוצים לחפש',
  noMatch: (query: string): string =>
    `לא מצאנו תמונה ל„${query}”. נסו מילה אחרת.`,
} as const;
