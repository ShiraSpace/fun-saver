import { JSX } from 'react';
import { useIsLoaderShown } from '@/hooks/loader-context';

export const IS_LOADER_SHOWN_TEST_ID = 'is-loader-shown';

export function IsLoaderShown(): JSX.Element {
  const isLoaderShown = String(useIsLoaderShown());

  return <output data-testid={IS_LOADER_SHOWN_TEST_ID}>{isLoaderShown}</output>;
}
