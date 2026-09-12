'use client';

import { ChangeEvent, JSX } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import {
  NAME_FIELD_COPY,
  NAME_FIELD_STYLE,
  NAME_FIELD_TEST_IDS,
} from './constants';

const surface = ({ theme }: { theme: Theme }): string => theme.colors.surface;
const labelColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;
const valueColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

const Card = styled.label`
  display: flex;
  align-items: center;
  gap: ${NAME_FIELD_STYLE.gap}px;
  width: 100%;
  max-width: ${NAME_FIELD_STYLE.maxWidth}px;
  padding: ${NAME_FIELD_STYLE.paddingY}px ${NAME_FIELD_STYLE.paddingX}px;
  border-radius: ${NAME_FIELD_STYLE.radius}px;
  background: ${surface};
  box-shadow: ${NAME_FIELD_STYLE.shadow};
  color: ${labelColor};
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font: inherit;
  font-weight: 700;
  color: ${valueColor};
`;

export interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function NameField({ value, onChange }: NameFieldProps): JSX.Element {
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
        onChange={handleChange}
      />
    </Card>
  );
}
