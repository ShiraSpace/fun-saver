import { JSX, Suspense, use, useEffect, useState } from 'react';
import { act, fireEvent, render, screen } from '@/test-utils/render';
import { mockRouter } from '@mocks/next/navigation';
import {
  IS_LOADER_SHOWN_TEST_ID,
  IsLoaderShown,
} from '@/test-utils/is-loader-shown';
import { useRefreshBalances } from './use-refresh-balances';

const SHOW_NEW_BALANCES_TEST_ID = 'show-new-balances';

interface NewBalancesProps {
  arriving: Promise<void> | null;
}

function NewBalances({ arriving }: NewBalancesProps): null {
  if (arriving) {
    use(arriving);
  }

  return null;
}

interface AccountScreenProps {
  newBalances: Promise<void>;
}

function AccountScreen({ newBalances }: AccountScreenProps): JSX.Element {
  const [arriving, setArriving] = useState<Promise<void> | null>(null);
  const refreshBalances = useRefreshBalances();

  useEffect(() => {
    mockRouter.refresh.mockImplementation(() => setArriving(newBalances));
  }, [newBalances]);

  return (
    <>
      <Suspense fallback={null}>
        <NewBalances arriving={arriving} />
      </Suspense>
      <button
        data-testid={SHOW_NEW_BALANCES_TEST_ID}
        onClick={refreshBalances}
      />
      <IsLoaderShown />
    </>
  );
}

describe('useRefreshBalances', () => {
  let newBalancesArrive = (): void => {};

  beforeEach(async () => {
    const mockNewBalances = new Promise<void>((resolve) => {
      newBalancesArrive = resolve;
    });

    mockRouter.refresh.mockReset();
    render(<AccountScreen newBalances={mockNewBalances} />);
    await act(async () =>
      fireEvent.click(screen.getByTestId(SHOW_NEW_BALANCES_TEST_ID))
    );
  });

  it('asks for the new balances once', () => {
    expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
  });

  it('runs the header loader while the new balances load', () => {
    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent(
      'true'
    );
  });

  it('stops the header loader once the new balances have arrived', async () => {
    await act(async () => newBalancesArrive());

    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent(
      'false'
    );
  });
});
