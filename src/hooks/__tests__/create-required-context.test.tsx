import { JSX } from 'react';
import { render, screen } from '@/test-utils/render';
import { createRequiredContext } from '../create-required-context';

const MISSING_PROVIDER = 'useName needs a NameProvider above it';
const NAME = 'Noa';
const NOTHING = 'nothing';
const NAME_TESTID = 'name';

const [NameProvider, useName, useOptionalName] =
  createRequiredContext<string>(MISSING_PROVIDER);

function RequiredName(): JSX.Element {
  return <span data-testid={NAME_TESTID}>{useName()}</span>;
}

function OptionalName(): JSX.Element {
  return <span data-testid={NAME_TESTID}>{useOptionalName() ?? NOTHING}</span>;
}

describe('a context that must have a provider', () => {
  it('hands the provided value to whoever asks', () => {
    render(
      <NameProvider value={NAME}>
        <RequiredName />
      </NameProvider>
    );

    expect(screen.getByTestId(NAME_TESTID)).toHaveTextContent(NAME);
  });

  it('refuses to guess, in the words it was given, when no provider is above it', () => {
    expect(() => render(<RequiredName />)).toThrow(MISSING_PROVIDER);
  });

  it('answers that there is nothing rather than throwing, for callers that only ask', () => {
    render(<OptionalName />);

    expect(screen.getByTestId(NAME_TESTID)).toHaveTextContent(NOTHING);
  });

  it('hands the same value to callers that only ask, when a provider is above it', () => {
    render(
      <NameProvider value={NAME}>
        <OptionalName />
      </NameProvider>
    );

    expect(screen.getByTestId(NAME_TESTID)).toHaveTextContent(NAME);
  });
});
