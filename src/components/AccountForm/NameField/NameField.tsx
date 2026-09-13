'use client';

import { ChangeEvent, JSX } from 'react';
import { NAME_FIELD_COPY, NAME_FIELD_TEST_IDS } from './constants';
import { Card, Input } from './NameField.styles';

export interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

export function NameField({
  value,
  onChange,
  maxLength,
}: NameFieldProps): JSX.Element {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void =>
    onChange(event.target.value);

  return (
    <Card data-testid={NAME_FIELD_TEST_IDS.field}>
      <span data-testid={NAME_FIELD_TEST_IDS.label}>
        {NAME_FIELD_COPY.label}
      </span>
      <Input
        data-testid={NAME_FIELD_TEST_IDS.input}
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
      />
    </Card>
  );
}
