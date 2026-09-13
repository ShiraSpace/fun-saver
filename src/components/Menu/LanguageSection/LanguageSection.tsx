'use client';

import { JSX } from 'react';
import { MenuLabel } from '../MenuLabel';
import {
  LANGUAGE_SECTION_CONTENT,
  LANGUAGE_SECTION_TEST_IDS,
} from './constants';
import { Segment, Option } from './LanguageSection.styles';

export function LanguageSection(): JSX.Element {
  const languageSelectorComponents = LANGUAGE_SECTION_CONTENT.options.map(
    (option) => (
      <Option
        key={option.code}
        data-testid={LANGUAGE_SECTION_TEST_IDS.option}
        data-selected={option.code === LANGUAGE_SECTION_CONTENT.selectedCode}
      >
        {option.label}
      </Option>
    )
  );

  return (
    <section data-testid={LANGUAGE_SECTION_TEST_IDS.section}>
      <MenuLabel>{LANGUAGE_SECTION_CONTENT.label}</MenuLabel>
      <Segment>{languageSelectorComponents}</Segment>
    </section>
  );
}
