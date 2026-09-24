import { JSX } from 'react';
import { Checklist } from '../Checklist';
import { GoalOutcome } from '../GoalOutcome';
import { MethodBlocks } from '../MethodBlocks';
import { MethodSection } from '../MethodSection';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY, type MethodBlock } from '../copy';
import { Rules } from './PromiseSection.styles';

const { promise } = METHOD_COPY;

const PROMISE_BLOCKS: readonly MethodBlock[] = [promise.body, promise.evidence];

export function PromiseSection(): JSX.Element {
  const rules = Object.entries(promise.rule).map(([name, rule]) => (
    <GoalOutcome key={name} {...rule} />
  ));

  return (
    <MethodSection
      id={SECTION_NUMBER.promise}
      title={promise.title}
      hint={promise.hint}
    >
      <MethodBlocks blocks={PROMISE_BLOCKS} />
      <Rules>{rules}</Rules>
      <Checklist {...promise.checklist} />
    </MethodSection>
  );
}
