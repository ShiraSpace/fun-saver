import { JSX } from 'react';
import { ActionList } from '../ActionList';
import { GoalOutcome } from '../GoalOutcome';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { METHOD_COPY, type MethodBlock } from '../copy';
import { PROMISE_SECTION } from './constants';
import { Rules } from './PromiseSection.styles';

const { promise } = METHOD_COPY;

const PROMISE_BLOCKS: readonly MethodBlock[] = [promise.body, promise.evidence];

export function PromiseSection(): JSX.Element {
  const rules = Object.entries(promise.rule).map(([name, rule]) => (
    <GoalOutcome key={name} {...rule} />
  ));

  return (
    <MethodSection
      number={PROMISE_SECTION.number}
      title={promise.title}
      hint={promise.hint}
    >
      <MethodBlocks blocks={PROMISE_BLOCKS} />
      <Rules>{rules}</Rules>
      <ActionList {...promise.action} />
    </MethodSection>
  );
}
