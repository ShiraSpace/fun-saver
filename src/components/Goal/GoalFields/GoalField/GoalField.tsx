import { ChangeEvent, HTMLAttributes, JSX, useId } from 'react';
import { Card, Field, FieldError, Input } from './GoalField.styles';

interface GoalFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  error?: string;
  errorTestId: string;
  'data-testid': string;
}

export function GoalField({
  label,
  value,
  onChange,
  maxLength,
  inputMode,
  error,
  errorTestId,
  'data-testid': testId,
}: GoalFieldProps): JSX.Element {
  const errorId = useId();
  const hasError = Boolean(error);
  const describedBy = hasError ? errorId : undefined;
  const errorMessage = hasError && (
    <FieldError id={errorId} role="alert" data-testid={errorTestId}>
      {error}
    </FieldError>
  );

  const handleChange = (changeEvent: ChangeEvent<HTMLInputElement>): void =>
    onChange(changeEvent.target.value);

  return (
    <Field>
      <Card invalid={hasError}>
        <span>{label}</span>
        <Input
          data-testid={testId}
          value={value}
          maxLength={maxLength}
          inputMode={inputMode}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          onChange={handleChange}
        />
      </Card>
      {errorMessage}
    </Field>
  );
}
