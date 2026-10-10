import { JSX } from 'react';
import { useIsLoaderShown } from '@/hooks/loader-context';

export const IS_LOADER_SHOWN_TEST_ID = 'is-loader-shown';

export function IsLoaderShown(): JSX.Element {
  return (
    <output data-testid={IS_LOADER_SHOWN_TEST_ID}>
      {String(useIsLoaderShown())}
    </output>
  );
}
