import { JSX } from 'react';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { METHOD_COPY, type MethodBlock } from '../copy';
import { WHY_SECTION } from './constants';

const { why } = METHOD_COPY;

const WHY_BLOCKS: readonly MethodBlock[] = [
  why.body,
  why.evidence,
  why.noTransfers,
  why.honest,
];

export function WhySection(): JSX.Element {
  return (
    <MethodSection number={WHY_SECTION.number} title={why.title}>
      <MethodBlocks blocks={WHY_BLOCKS} />
    </MethodSection>
  );
}
