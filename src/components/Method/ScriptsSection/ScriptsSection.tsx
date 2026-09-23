import { JSX } from 'react';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY, type MethodBlock } from '../copy';

const { scripts } = METHOD_COPY;

const SCRIPT_BLOCKS: readonly MethodBlock[] = [
  scripts.intro,
  ...scripts.moments.flatMap((moment) => [moment.heading, moment.talk]),
];

export function ScriptsSection(): JSX.Element {
  return (
    <MethodSection id={SECTION_NUMBER.scripts} title={scripts.title}>
      <MethodBlocks blocks={SCRIPT_BLOCKS} />
    </MethodSection>
  );
}
