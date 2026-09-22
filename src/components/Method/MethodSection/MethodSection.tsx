import { JSX, ReactNode } from 'react';
import { emphasize } from '../rich-text';
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
  const heading = emphasize(title);
  const hintChip = hint && (
    <Hint data-testid={METHOD_SECTION_TEST_IDS.hint(number)}>
      {emphasize(hint)}
    </Hint>
  );

  return (
    <Section data-testid={METHOD_SECTION_TEST_IDS.section(number)}>
      <Summary data-testid={METHOD_SECTION_TEST_IDS.summary(number)}>
        <Numeral>{number}</Numeral>
        <Title>{heading}</Title>
        {hintChip}
        <Chevron aria-hidden="true">{METHOD_SECTION_COPY.chevron}</Chevron>
      </Summary>
      <Body data-testid={METHOD_SECTION_TEST_IDS.body(number)}>{children}</Body>
    </Section>
  );
}
