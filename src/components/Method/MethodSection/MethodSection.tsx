import { JSX, ReactNode } from 'react';
import { METHOD_SECTION_COPY, METHOD_SECTION_TEST_IDS } from './constants';
import {
  Body,
  Chevron,
  Hint,
  Numeral,
  Section,
  Summary,
  Title,
} from './MethodSection.styles';

interface MethodSectionProps {
  number: number;
  title: string;
  hint?: string;
  children: ReactNode;
}

export function MethodSection({
  number,
  title,
  hint,
  children,
}: MethodSectionProps): JSX.Element {
  const hintChip = hint && (
    <Hint data-testid={METHOD_SECTION_TEST_IDS.hint}>{hint}</Hint>
  );

  return (
    <Section data-testid={METHOD_SECTION_TEST_IDS.section}>
      <Summary data-testid={METHOD_SECTION_TEST_IDS.summary}>
        <Numeral>{number}</Numeral>
        <Title>{title}</Title>
        {hintChip}
        <Chevron aria-hidden="true">{METHOD_SECTION_COPY.chevron}</Chevron>
      </Summary>
      <Body>{children}</Body>
    </Section>
  );
}
