import { JSX } from 'react';
import { useIsNavigating } from '@/hooks/navigation-pending-context';

export const IS_NAVIGATING_TEST_ID = 'is-navigating';

export function IsNavigating(): JSX.Element {
  return (
    <output data-testid={IS_NAVIGATING_TEST_ID}>
      {String(useIsNavigating())}
    </output>
  );
}
