import { JSX } from 'react';
import { ActionList } from '../ActionList';
import { ExampleWalletSplitTable } from '../ExampleWalletSplitTable';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { METHOD_COPY, type MethodBlock } from '../copy';
import { ACTIONS_SECTION } from './constants';

const { actions } = METHOD_COPY;

const ALLOWANCE_BLOCKS: readonly MethodBlock[] = [
  actions.intro,
  actions.amount,
  actions.frequency,
  actions.split,
];

const RULE_BLOCKS: readonly MethodBlock[] = [
  actions.chores,
  actions.choresEvidence,
  actions.rescue,
];

export function ActionsSection(): JSX.Element {
  return (
    <MethodSection number={ACTIONS_SECTION.number} title={actions.title}>
      <MethodBlocks blocks={ALLOWANCE_BLOCKS} />
      <ExampleWalletSplitTable {...actions.example} />
      <MethodBlocks blocks={RULE_BLOCKS} />
      <ActionList {...actions.decide} />
      <ActionList {...actions.communicate} />
    </MethodSection>
  );
}
