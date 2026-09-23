import { JSX } from 'react';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY, type MethodBlock } from '../copy';

const { why } = METHOD_COPY;

const WHY_BLOCKS: readonly MethodBlock[] = [
  why.body,
  why.evidence,
  why.noTransfers,
  why.honest,
];

export function WhySection(): JSX.Element {
  return (
    <MethodSection id={SECTION_NUMBER.why} title={why.title}>
      <MethodBlocks blocks={WHY_BLOCKS} />
    </MethodSection>
  );
}
