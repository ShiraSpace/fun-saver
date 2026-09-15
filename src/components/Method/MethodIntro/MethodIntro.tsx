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
  return (
    <Intro data-testid={METHOD_INTRO_TEST_IDS.intro}>
      <Eyebrow>{goal.eyebrow}</Eyebrow>
      <Title>{goal.title}</Title>
      <Lead>{emphasize(goal.body.body)}</Lead>
      <Outcomes>
        {Object.entries(goal.outcome).map(([name, outcome]) => (
          <GoalOutcome key={name} {...outcome} />
        ))}
      </Outcomes>
      <Derived>{emphasize(goal.derived)}</Derived>
      <Divider />
      <Brief data-testid={METHOD_INTRO_TEST_IDS.brief}>
        {`${brief.eyebrow}${METHOD_INTRO_COPY.briefSeparator}${brief.body}`}
      </Brief>
      <BriefNote>{brief.note}</BriefNote>
    </Intro>
  );
}
