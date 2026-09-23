'use client';

import { createContext, Provider, useContext } from 'react';

export function createRequiredContext<T>(
  missingProviderMessage: string
): [Provider<T | null>, () => T, () => T | null] {
  const Context = createContext<T | null>(null);

  function useOptional(): T | null {
    return useContext(Context);
  }

  function useRequired(): T {
    const value = useOptional();

    if (value === null) {
      throw new Error(missingProviderMessage);
    }

    return value;
  }

  return [Context.Provider, useRequired, useOptional];
}
