import { JSX } from 'react';
import { GoalOutcome } from '../GoalOutcome';
import { METHOD_COPY } from '../copy';
import { emphasize } from '../rich-text';
import { METHOD_INTRO_COPY, METHOD_INTRO_TEST_IDS } from './constants';
import {
  Brief,
  BriefNote,
  Derived,
  Divider,
  Eyebrow,
  Intro,
  Lead,
  Outcomes,
  Title,
} from './MethodIntro.styles';

const { goal, brief } = METHOD_COPY;

export function MethodIntro(): JSX.Element {
  const lead = emphasize(goal.body.body);
  const derived = emphasize(goal.derived);
  const outcomes = Object.entries(goal.outcome).map(([name, outcome]) => (
    <GoalOutcome key={name} {...outcome} />
  ));
  const briefLine = `${brief.eyebrow}${METHOD_INTRO_COPY.briefSeparator}${brief.body}`;

  return (
    <Intro data-testid={METHOD_INTRO_TEST_IDS.intro}>
      <Eyebrow>{goal.eyebrow}</Eyebrow>
      <Title>{goal.title}</Title>
      <Lead>{lead}</Lead>
      <Outcomes>{outcomes}</Outcomes>
      <Derived>{derived}</Derived>
      <Divider />
      <Brief data-testid={METHOD_INTRO_TEST_IDS.brief}>{briefLine}</Brief>
      <BriefNote>{brief.note}</BriefNote>
    </Intro>
  );
}
