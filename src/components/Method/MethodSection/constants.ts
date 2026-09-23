import { SOURCES_SECTION_ID } from '../constants';

export type MethodSectionId = number | typeof SOURCES_SECTION_ID;

export const METHOD_SECTION_TEST_IDS = {
  section: (id: MethodSectionId): string => `method-section-${id}`,
  summary: (id: MethodSectionId): string => `method-section-summary-${id}`,
  numeral: (id: MethodSectionId): string => `method-section-numeral-${id}`,
  chevron: (id: MethodSectionId): string => `method-section-chevron-${id}`,
  hint: (id: MethodSectionId): string => `method-section-hint-${id}`,
  body: (id: MethodSectionId): string => `method-section-body-${id}`,
} as const;

export const METHOD_SECTION_COPY = {
  chevron: '▾',
} as const;
