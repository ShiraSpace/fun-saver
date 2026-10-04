export const PICTURE_TILES_TEST_IDS = {
  grid: 'picture-tiles',
  tile: 'picture-tile',
  stateLine: 'picture-tiles-state-line',
} as const;

export const PICTURE_TILES_COPY = {
  loading: 'מחפשים תמונות…',
  failed: 'אופס, התמונות לא נטענו. סגרו ונסו שוב.',
  hint: 'כתבו מה רוצים לחפש',
  noMatch: (query: string): string =>
    `לא מצאנו תמונה ל„${query}”. נסו מילה אחרת.`,
} as const;
