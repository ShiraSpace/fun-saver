import { JSX } from 'react';
import { KeyPoint } from '../KeyPoint';
import { METHOD_COPY } from '../copy';
import { emphasize } from '../rich-text';
import { METHOD_INTRO_COPY, METHOD_INTRO_TEST_IDS } from './constants';
import {
  Brief,
  BriefNote,
  AlongTheWay,
  Divider,
  Eyebrow,
  Intro,
  Lead,
  Outcomes,
  Title,
} from './MethodIntro.styles';

const { goal, brief } = METHOD_COPY;

export function MethodIntro(): JSX.Element {
  const eyebrow = emphasize(goal.eyebrow);
  const title = emphasize(goal.title);
  const lead = emphasize(goal.body.body);
  const alongTheWay = emphasize(goal.alongTheWay);
  const outcomes = Object.entries(goal.outcomes).map(
    ([walletName, outcome]) => <KeyPoint key={walletName} {...outcome} />
  );
  const briefLine = emphasize(
    `${brief.eyebrow}${METHOD_INTRO_COPY.briefSeparator}${brief.body}`
  );
  const briefNote = emphasize(brief.note);

  return (
    <Intro data-testid={METHOD_INTRO_TEST_IDS.intro}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Title>{title}</Title>
      <Lead>{lead}</Lead>
      <Outcomes>{outcomes}</Outcomes>
      <AlongTheWay>{alongTheWay}</AlongTheWay>
      <Divider />
      <Brief data-testid={METHOD_INTRO_TEST_IDS.brief}>{briefLine}</Brief>
      <BriefNote>{briefNote}</BriefNote>
    </Intro>
  );
}
