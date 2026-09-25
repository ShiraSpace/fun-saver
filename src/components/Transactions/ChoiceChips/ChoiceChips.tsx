'use client';

import { JSX } from 'react';
import {
  CHOICE_CHIPS_TEST_IDS,
  CHOICE_CHIPS_VARIANT,
  type ChoiceChipsVariant,
} from './constants';
import { Chip, Group, GroupName, Radio } from './ChoiceChips.styles';

export interface Choice<Id extends string> {
  id: Id;
  label: string;
}

interface ChoiceChipsProps<Id extends string> {
  variant?: ChoiceChipsVariant;
  groupName: string;
  legend: string;
  choices: readonly Choice<Id>[];
  selected: Id;
  onSelect: (id: Id) => void;
  testId: string;
}

export function ChoiceChips<Id extends string>({
  groupName,
  legend,
  choices,
  selected,
  onSelect,
  testId,
  variant = CHOICE_CHIPS_VARIANT.chips,
}: ChoiceChipsProps<Id>): JSX.Element {
  const chips = choices.map((choice) => (
    <Chip key={choice.id}>
      <Radio
        type="radio"
        name={groupName}
        checked={choice.id === selected}
        onChange={(): void => onSelect(choice.id)}
        data-testid={CHOICE_CHIPS_TEST_IDS.option(testId, choice.id)}
      />
      {choice.label}
    </Chip>
  ));

  return (
    <Group data-variant={variant}>
      <GroupName>{legend}</GroupName>
      {chips}
    </Group>
  );
}
