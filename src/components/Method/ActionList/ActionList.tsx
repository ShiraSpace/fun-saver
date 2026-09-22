import { JSX } from 'react';
import type { ActionGroup, ActionItem } from '../copy';
import { emphasize } from '../rich-text';
import { ACTION_LIST_COPY, ACTION_LIST_TEST_IDS } from './constants';
import {
  Answer,
  Group,
  Item,
  Items,
  Label,
  Question,
  Status,
} from './ActionList.styles';

function actionRow(action: ActionItem): JSX.Element {
  const status = action.done ? ACTION_LIST_COPY.settled : ACTION_LIST_COPY.open;
  const question = emphasize(action.question);
  const answer = emphasize(action.answer);

  return (
    <Item key={action.question} data-testid={ACTION_LIST_TEST_IDS.item}>
      <Status
        role="img"
        aria-label={status}
        data-done={action.done}
        data-testid={ACTION_LIST_TEST_IDS.status}
      />
      <div>
        <Question>{question}</Question>
        <Answer>{answer}</Answer>
      </div>
    </Item>
  );
}

export function ActionList({ label, items }: ActionGroup): JSX.Element {
  const heading = emphasize(label);
  const actions = items.map(actionRow);

  return (
    <Group data-testid={ACTION_LIST_TEST_IDS.group}>
      <Label>{heading}</Label>
      <Items>{actions}</Items>
    </Group>
  );
}
