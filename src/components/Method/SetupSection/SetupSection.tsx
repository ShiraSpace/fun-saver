import { JSX } from 'react';
import { Checklist } from '../Checklist';
import { ExampleWalletSplitTable } from '../ExampleWalletSplitTable';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY, type MethodBlock } from '../copy';

const { setup } = METHOD_COPY;

const ALLOWANCE_BLOCKS: readonly MethodBlock[] = [
  setup.intro,
  setup.amount,
  setup.frequency,
  setup.split,
];

const RULE_BLOCKS: readonly MethodBlock[] = [
  setup.chores,
  setup.choresEvidence,
  setup.rescue,
];

export function SetupSection(): JSX.Element {
  return (
    <MethodSection id={SECTION_NUMBER.setup} title={setup.title}>
      <MethodBlocks blocks={ALLOWANCE_BLOCKS} />
      <ExampleWalletSplitTable {...setup.example} />
      <MethodBlocks blocks={RULE_BLOCKS} />
      <Checklist {...setup.decide} />
      <Checklist {...setup.communicate} />
    </MethodSection>
  );
}
