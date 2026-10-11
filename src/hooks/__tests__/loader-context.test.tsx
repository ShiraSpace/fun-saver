import { JSX, useState } from 'react';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  type RenderResult,
} from '@testing-library/react';
import {
  LoaderProvider,
  useIsLoaderShown,
  useReportLoader,
  useRefreshWithLoader,
} from '../loader-context';
import { missingProviderMessage } from '../create-required-context';
import { LEAVE_SCREEN_TEST_ID, START_WORK_TEST_ID } from './constants';
import { IS_LOADER_SHOWN_TEST_ID, IsLoaderShown } from '@/test-utils/is-loader-shown';
import { holdRefresh, NewPageData, type HeldRefresh } from '@/test-utils/held-refresh';

interface PendingWorkProps {
  isPending: boolean;
}

function PendingWork({ isPending }: PendingWorkProps): null {
  useReportLoader(isPending);

  return null;
}

interface TwoPiecesOfWorkProps {
  firstPending: boolean;
  secondPending: boolean;
}

function TwoPiecesOfWork({ firstPending, secondPending }: TwoPiecesOfWorkProps): JSX.Element {
  return (
    <LoaderProvider>
      <PendingWork isPending={firstPending} />
      <PendingWork isPending={secondPending} />
      <IsLoaderShown />
    </LoaderProvider>
  );
}

function WorkStarter(): JSX.Element {
  const refreshWithLoader = useRefreshWithLoader();

  return <button data-testid={START_WORK_TEST_ID} onClick={refreshWithLoader} />;
}

interface PageProps {
  heldRefresh: HeldRefresh;
}

function Page({ heldRefresh }: PageProps): JSX.Element {
  const [isWorkStarterShown, setIsWorkStarterShown] = useState(true);

  return (
    <LoaderProvider>
      <NewPageData heldRefresh={heldRefresh} />
      {isWorkStarterShown && <WorkStarter />}
      <button data-testid={LEAVE_SCREEN_TEST_ID} onClick={() => setIsWorkStarterShown(false)} />
      <IsLoaderShown />
    </LoaderProvider>
  );
}

describe('the loader', () => {
  let view: RenderResult;

  beforeEach(() => {
    view = render(<TwoPiecesOfWork firstPending={false} secondPending={true} />);
  });

  it('shows while any work is pending', () => {
    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent('true');
  });

  it('still shows when two pieces of work swap in a single update', () => {
    view.rerender(<TwoPiecesOfWork firstPending={true} secondPending={false} />);

    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent('true');
  });

  it('still shows while one piece of work is pending after the other is done', () => {
    view.rerender(<TwoPiecesOfWork firstPending={true} secondPending={true} />);
    view.rerender(<TwoPiecesOfWork firstPending={false} secondPending={true} />);

    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent('true');
  });

  it('hides once all work is done', () => {
    view.rerender(<TwoPiecesOfWork firstPending={false} secondPending={false} />);

    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent('false');
  });
});

describe('a refresh run with the loader', () => {
  let mockHeldRefresh: HeldRefresh;

  beforeEach(async () => {
    mockHeldRefresh = holdRefresh();
    render(<Page heldRefresh={mockHeldRefresh} />);
    await act(async () => fireEvent.click(screen.getByTestId(START_WORK_TEST_ID)));
  });

  it('shows the loader while the new page data is on its way', () => {
    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent('true');
  });

  it('hides the loader once the new page data has arrived', async () => {
    await mockHeldRefresh.release();

    await waitFor(() =>
      expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent('false')
    );
  });

  it('keeps the loader shown after the screen that started the work has gone', () => {
    fireEvent.click(screen.getByTestId(LEAVE_SCREEN_TEST_ID));

    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent('true');
  });
});

describe('the loader without a LoaderProvider', () => {
  it('refuses to guess whether it is shown', () => {
    expect(() => renderHook(() => useIsLoaderShown())).toThrow(
      missingProviderMessage('LoaderProvider')
    );
  });

  it('refuses a report of pending work', () => {
    expect(() => renderHook(() => useReportLoader(true))).toThrow(
      missingProviderMessage('LoaderProvider')
    );
  });
});
