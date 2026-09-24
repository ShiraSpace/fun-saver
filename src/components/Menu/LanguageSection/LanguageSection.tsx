'use client';

import { JSX } from 'react';
import { MenuSectionTitle } from '../MenuSectionTitle';
import { LANGUAGE_SECTION_COPY, LANGUAGE_SECTION_TEST_IDS } from './constants';
import { Segment, Option } from './LanguageSection.styles';

export function LanguageSection(): JSX.Element {
  const languageSelectorComponents = LANGUAGE_SECTION_COPY.options.map(
    (option) => (
      <Option
        key={option.code}
        data-testid={LANGUAGE_SECTION_TEST_IDS.option}
        data-selected={option.code === LANGUAGE_SECTION_COPY.selectedCode}
      >
        {option.label}
      </Option>
    )
  );

  return (
    <section data-testid={LANGUAGE_SECTION_TEST_IDS.section}>
      <MenuSectionTitle>{LANGUAGE_SECTION_COPY.label}</MenuSectionTitle>
      <Segment>{languageSelectorComponents}</Segment>
    </section>
  );
}
