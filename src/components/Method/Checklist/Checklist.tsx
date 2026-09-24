import { JSX } from 'react';
import type { ChecklistGroup, ChecklistItem } from '../copy';
import { emphasize } from '../rich-text';
import { CHECKLIST_COPY, CHECKLIST_TEST_IDS } from './constants';
import {
  Answer,
  Group,
  Item,
  Items,
  Label,
  Question,
  Checkbox,
} from './Checklist.styles';

function checklistItem(item: ChecklistItem): JSX.Element {
  const doneLabel = item.done ? CHECKLIST_COPY.done : CHECKLIST_COPY.notDone;
  const question = emphasize(item.question);
  const answer = emphasize(item.answer);

  return (
    <Item key={item.question} data-testid={CHECKLIST_TEST_IDS.item}>
      <Checkbox
        role="img"
        aria-label={doneLabel}
        data-done={item.done}
        data-testid={CHECKLIST_TEST_IDS.checkbox}
      />
      <div>
        <Question>{question}</Question>
        <Answer>{answer}</Answer>
      </div>
    </Item>
  );
}

export function Checklist({ label, items }: ChecklistGroup): JSX.Element {
  const heading = emphasize(label);
  const checklistItems = items.map(checklistItem);

  return (
    <Group data-testid={CHECKLIST_TEST_IDS.group}>
      <Label>{heading}</Label>
      <Items>{checklistItems}</Items>
    </Group>
  );
}
