'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { MenuLabel } from '../MenuLabel';
import {
  LANGUAGE_SECTION_CONTENT,
  LANGUAGE_SECTION_STYLE,
  LANGUAGE_SECTION_TEST_IDS,
} from './constants';

const selectedFill = ({ theme }: { theme: Theme }): string =>
  theme.gradients.actionButton;
const selectedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;
const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;
const optionSize = ({ theme }: { theme: Theme }): number => theme.typography.heading;

const Segment = styled.div`
  display: flex;
  border-radius: ${LANGUAGE_SECTION_STYLE.radius}px;
  overflow: hidden;
  background: ${({ theme }): string => theme.colors.surface};
`;

const Option = styled.span`
  flex: 1;
  text-align: center;
  padding: ${LANGUAGE_SECTION_STYLE.paddingY}px 0;
  font-size: ${optionSize}px;
  font-weight: 700;
  color: ${mutedText};

  &[data-selected='true'] {
    background: ${selectedFill};
    color: ${selectedText};
  }
`;

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
