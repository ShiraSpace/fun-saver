'use client';

import { useEffect, useState } from 'react';

export function useDebouncedValue<Value>(value: Value, delayMs: number): Value {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delayMs);
    return (): void => clearTimeout(timeout);
  }, [value, delayMs]);

  return debouncedValue;
}
