export type MethodSectionId = number | string;

export const METHOD_SECTION_TEST_IDS = {
  section: (id: MethodSectionId): string => `method-section-${id}`,
  summary: (id: MethodSectionId): string => `method-section-summary-${id}`,
  numeral: (id: MethodSectionId): string => `method-section-numeral-${id}`,
  hint: (id: MethodSectionId): string => `method-section-hint-${id}`,
  body: (id: MethodSectionId): string => `method-section-body-${id}`,
} as const;

export const METHOD_SECTION_COPY = {
  chevron: '▾',
} as const;
