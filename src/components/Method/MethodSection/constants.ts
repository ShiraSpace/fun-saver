export const METHOD_SECTION_TEST_IDS = {
  section: (number: number): string => `method-section-${number}`,
  summary: (number: number): string => `method-section-summary-${number}`,
  hint: (number: number): string => `method-section-hint-${number}`,
  body: (number: number): string => `method-section-body-${number}`,
} as const;

export const METHOD_SECTION_COPY = {
  chevron: '▾',
} as const;
