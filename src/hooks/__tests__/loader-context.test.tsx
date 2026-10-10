import { JSX } from 'react';
import {
  render,
  renderHook,
  screen,
  type RenderResult,
} from '@testing-library/react';
import {
  LoaderProvider,
  useIsLoaderShown,
  useReportLoader,
} from '../loader-context';
import { missingProviderMessage } from '../create-required-context';
import {
  IS_LOADER_SHOWN_TEST_ID,
  IsLoaderShown,
} from '@/test-utils/is-loader-shown';

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

function TwoPiecesOfWork({
  firstPending,
  secondPending,
}: TwoPiecesOfWorkProps): JSX.Element {
  return (
    <LoaderProvider>
      <PendingWork isPending={firstPending} />
      <PendingWork isPending={secondPending} />
      <IsLoaderShown />
    </LoaderProvider>
  );
}

describe('the loader', () => {
  let view: RenderResult;

  beforeEach(() => {
    view = render(
      <TwoPiecesOfWork firstPending={false} secondPending={true} />
    );
  });

  it('shows while any work is pending', () => {
    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent(
      'true'
    );
  });

  it('still shows when two pieces of work swap in a single update', () => {
    view.rerender(
      <TwoPiecesOfWork firstPending={true} secondPending={false} />
    );

    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent(
      'true'
    );
  });

  it('still shows while one piece of work is pending after the other is done', () => {
    view.rerender(<TwoPiecesOfWork firstPending={true} secondPending={true} />);
    view.rerender(
      <TwoPiecesOfWork firstPending={false} secondPending={true} />
    );

    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent(
      'true'
    );
  });

  it('hides once all work is done', () => {
    view.rerender(
      <TwoPiecesOfWork firstPending={false} secondPending={false} />
    );

    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent(
      'false'
    );
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
