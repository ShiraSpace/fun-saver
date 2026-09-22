import { JSX } from 'react';
import type { ActionGroup, ActionItem } from '../copy';
import { emphasize } from '../rich-text';
import { ACTION_LIST_COPY, ACTION_LIST_TEST_IDS } from './constants';
import {
  Answer,
  Box,
  Group,
  Item,
  Items,
  Label,
  Question,
} from './ActionList.styles';

function tick(item: ActionItem): JSX.Element {
  return (
    <Item key={item.question} data-testid={ACTION_LIST_TEST_IDS.item}>
      <Box
        role="img"
        data-done={item.done}
        data-testid={ACTION_LIST_TEST_IDS.box}
        aria-label={
          item.done ? ACTION_LIST_COPY.done : ACTION_LIST_COPY.pending
        }
      />
      <div>
        <Question>{emphasize(item.question)}</Question>
        <Answer>{emphasize(item.answer)}</Answer>
      </div>
    </Item>
  );
}

export function ActionList({ label, items }: ActionGroup): JSX.Element {
  return (
    <Group data-testid={ACTION_LIST_TEST_IDS.group}>
      <Label>{emphasize(label)}</Label>
      <Items>{items.map(tick)}</Items>
    </Group>
  );
}
