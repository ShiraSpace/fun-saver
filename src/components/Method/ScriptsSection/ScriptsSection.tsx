import { JSX } from 'react';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY, type MethodBlock } from '../copy';

const { scripts } = METHOD_COPY;

const SCRIPT_BLOCKS: readonly MethodBlock[] = [
  scripts.intro,
  scripts.first.heading,
  scripts.first.talk,
  scripts.ranOut.heading,
  scripts.ranOut.talk,
  scripts.wantsSavings.heading,
  scripts.wantsSavings.talk,
  scripts.interest.heading,
  scripts.interest.talk,
];

export function ScriptsSection(): JSX.Element {
  return (
    <MethodSection number={SECTION_NUMBER.scripts} title={scripts.title}>
      <MethodBlocks blocks={SCRIPT_BLOCKS} />
    </MethodSection>
  );
}
