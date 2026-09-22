import { JSX, ReactNode } from 'react';
import { emphasize } from '../rich-text';
import {
  METHOD_SECTION_COPY,
  METHOD_SECTION_TEST_IDS,
  type MethodSectionId,
} from './constants';
import {
  Body,
  Chevron,
  Hint,
  Numeral,
  Section,
  Summary,
  Title,
} from './MethodSection.styles';

type MethodSectionProps = {
  title: string;
  hint?: string;
  children: ReactNode;
} & (
  | { number: number; id?: undefined }
  | { number?: undefined; id: MethodSectionId }
);

export function MethodSection(props: MethodSectionProps): JSX.Element {
  const { number, title, hint, children } = props;

  const id: MethodSectionId = props.id === undefined ? props.number : props.id;
  const heading = emphasize(title);
  const numeral = number !== undefined && (
    <Numeral data-testid={METHOD_SECTION_TEST_IDS.numeral(id)}>
      {number}
    </Numeral>
  );
  const hintChip = hint && (
    <Hint data-testid={METHOD_SECTION_TEST_IDS.hint(id)}>
      {emphasize(hint)}
    </Hint>
  );

  return (
    <Section data-testid={METHOD_SECTION_TEST_IDS.section(id)}>
      <Summary data-testid={METHOD_SECTION_TEST_IDS.summary(id)}>
        {numeral}
        <Title>{heading}</Title>
        {hintChip}
        <Chevron aria-hidden="true">{METHOD_SECTION_COPY.chevron}</Chevron>
      </Summary>
      <Body data-testid={METHOD_SECTION_TEST_IDS.body(id)}>{children}</Body>
    </Section>
  );
}
