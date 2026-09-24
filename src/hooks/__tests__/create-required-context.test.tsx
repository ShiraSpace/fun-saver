import { JSX, ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { createRequiredContext } from '../create-required-context';

const mockProviderName = 'NameProvider';
const mockName = 'Noa';

const [NameProvider, useName, useOptionalName] =
  createRequiredContext<string>(mockProviderName);

function WithName({ children }: { children: ReactNode }): JSX.Element {
  return <NameProvider value={mockName}>{children}</NameProvider>;
}

describe('a context that must have a provider', () => {
  it('hands the provided value to whoever asks', () => {
    const { result } = renderHook(() => useName(), { wrapper: WithName });

    expect(result.current).toBe(mockName);
  });

  it('refuses to guess, naming the provider it needs, when no provider is above it', () => {
    expect(() => renderHook(() => useName())).toThrow(
      'No NameProvider above this component'
    );
  });

  it('answers null rather than throwing, for callers that only ask', () => {
    const { result } = renderHook(() => useOptionalName());

    expect(result.current).toBeNull();
  });

  it('hands the same value to callers that only ask, when a provider is above it', () => {
    const { result } = renderHook(() => useOptionalName(), {
      wrapper: WithName,
    });

    expect(result.current).toBe(mockName);
  });
});
