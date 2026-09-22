import { JSX } from 'react';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY, type MethodBlock } from '../copy';

const { limits } = METHOD_COPY;

const LIMIT_BLOCKS: readonly MethodBlock[] = [
  limits.magnitude,
  limits.allowance,
  limits.digital,
  limits.recommendation,
  limits.interest,
];

export function LimitsSection(): JSX.Element {
  return (
    <MethodSection
      id={SECTION_NUMBER.limits}
      number={SECTION_NUMBER.limits}
      title={limits.title}
    >
      <MethodBlocks blocks={LIMIT_BLOCKS} />
    </MethodSection>
  );
}
