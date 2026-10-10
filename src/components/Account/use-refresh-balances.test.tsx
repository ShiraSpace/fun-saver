import { JSX, Suspense, use, useEffect, useState } from 'react';
import { act, fireEvent, render, screen } from '@/test-utils/render';
import { mockRouter } from '@mocks/next/navigation';
import { useIsNavigating } from '@/components/Header/navigation-pending-context';
import { useRefreshBalances } from './use-refresh-balances';

const HEADER_LOADER = 'header-loader';
const SHOW_NEW_BALANCES = 'show-new-balances';

interface NewBalancesProps {
  loading: Promise<void> | null;
}

function NewBalances({ loading }: NewBalancesProps): null {
  if (loading) {
    use(loading);
  }

  return null;
}

interface AccountScreenProps {
  newBalancesLoading: Promise<void>;
}

function AccountScreen({
  newBalancesLoading,
}: AccountScreenProps): JSX.Element {
  const [loading, setLoading] = useState<Promise<void> | null>(null);
  const refreshBalances = useRefreshBalances();
  const isNavigating = useIsNavigating();

  useEffect(() => {
    mockRouter.refresh.mockImplementation(() => setLoading(newBalancesLoading));
  }, [newBalancesLoading]);

  return (
    <>
      <Suspense fallback={null}>
        <NewBalances loading={loading} />
      </Suspense>
      <button data-testid={SHOW_NEW_BALANCES} onClick={refreshBalances} />
      <output data-testid={HEADER_LOADER}>{String(isNavigating)}</output>
    </>
  );
}

describe('useRefreshBalances', () => {
  let newBalancesArrive = (): void => {};

  beforeEach(async () => {
    const mockNewBalancesLoading = new Promise<void>((resolve) => {
      newBalancesArrive = resolve;
    });

    mockRouter.refresh.mockReset();
    render(<AccountScreen newBalancesLoading={mockNewBalancesLoading} />);
    await act(async () =>
      fireEvent.click(screen.getByTestId(SHOW_NEW_BALANCES))
    );
  });

  afterEach(() => {
    mockRouter.refresh.mockReset();
  });

  it('asks for the new balances once', () => {
    expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
  });

  it('runs the header loader while the new balances load', () => {
    expect(screen.getByTestId(HEADER_LOADER)).toHaveTextContent('true');
  });

  it('stops the header loader once the new balances have arrived', async () => {
    await act(async () => newBalancesArrive());

    expect(screen.getByTestId(HEADER_LOADER)).toHaveTextContent('false');
  });
});
