'use client';

import { createContext, Provider, useContext } from 'react';

export function missingProviderMessage(providerName: string): string {
  return `No ${providerName} above this component`;
}

export function createRequiredContext<T>(
  providerName: string
): [Provider<T | null>, () => T, () => T | null] {
  const Context = createContext<T | null>(null);
  Context.displayName = providerName;

  function useOptional(): T | null {
    return useContext(Context);
  }

  function useRequired(): T {
    const value = useOptional();

    if (value === null) {
      throw new Error(missingProviderMessage(providerName));
    }

    return value;
  }

  return [Context.Provider, useRequired, useOptional];
}
