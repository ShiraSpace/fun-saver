import { JSX } from 'react';
import type { TalkLine } from '../copy';
import { emphasize } from '../rich-text';
import { TALK_BUBBLE_TEST_IDS } from './constants';
import { Bubble, Label, Line } from './TalkBubble.styles';

interface TalkBubbleProps {
  label: string;
  lines: readonly TalkLine[];
}

export function TalkBubble({ label, lines }: TalkBubbleProps): JSX.Element {
  const heading = emphasize(label);
  const spoken = lines.map((line, index) => (
    <Line
      key={index}
      data-tone={line.tone}
      data-testid={TALK_BUBBLE_TEST_IDS.line}
    >
      {emphasize(line.text)}
    </Line>
  ));

  return (
    <Bubble data-testid={TALK_BUBBLE_TEST_IDS.bubble}>
      <Label data-testid={TALK_BUBBLE_TEST_IDS.label}>{heading}</Label>
      {spoken}
    </Bubble>
  );
}
