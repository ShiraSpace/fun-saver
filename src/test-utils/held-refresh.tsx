import { JSX, Suspense, use, useEffect, useState } from 'react';
import { act } from '@testing-library/react';
import { mockRouter } from '@mocks/next/navigation';

export interface HeldRefresh {
  newPageData: Promise<void>;
  release: () => Promise<void>;
}

export function holdRefresh(): HeldRefresh {
  const { promise, resolve } = Promise.withResolvers<void>();

  return {
    newPageData: promise,
    release: (): Promise<void> => act(async () => resolve()),
  };
}

export function useHeldRefresh(heldRefresh: HeldRefresh): void {
  const [arriving, setArriving] = useState<Promise<void> | null>(null);

  useEffect(() => {
    mockRouter.refresh.mockImplementation(() =>
      setArriving(heldRefresh.newPageData)
    );
  }, [heldRefresh]);

  if (arriving) {
    use(arriving);
  }
}

interface NewPageDataProps {
  heldRefresh: HeldRefresh;
}

function WaitForNewPageData({ heldRefresh }: NewPageDataProps): null {
  useHeldRefresh(heldRefresh);

  return null;
}

export function NewPageData({ heldRefresh }: NewPageDataProps): JSX.Element {
  return (
    <Suspense fallback={null}>
      <WaitForNewPageData heldRefresh={heldRefresh} />
    </Suspense>
  );
}
