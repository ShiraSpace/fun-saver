import { Context, JSX } from 'react';
import {
  render,
  renderHook,
  screen,
  type RenderResult,
} from '@testing-library/react';
import {
  LoaderProvider,
  LinkLoaderReporter,
  useIsLoaderShown,
  useReportLoader,
} from '../loader-context';
import { missingProviderMessage } from '../create-required-context';
import {
  IS_LOADER_SHOWN_TEST_ID,
  IsLoaderShown,
} from '@/test-utils/is-loader-shown';

jest.mock('next/link', () => {
  const { createContext, useContext } = jest.requireActual('react');
  const MockLinkPending = createContext(false);

  return {
    ...jest.requireActual('next/link'),
    MockLinkPending,
    useLinkStatus: (): { pending: boolean } => ({
      pending: useContext(MockLinkPending),
    }),
  };
});

const LinkPending: Context<boolean> =
  jest.requireMock('next/link').MockLinkPending;

interface LinksProps {
  homeLinkPending: boolean;
  homeTabPending: boolean;
}

function TwoLinks({
  homeLinkPending,
  homeTabPending,
}: LinksProps): JSX.Element {
  return (
    <LoaderProvider>
      <LinkPending.Provider value={homeLinkPending}>
        <LinkLoaderReporter />
      </LinkPending.Provider>
      <LinkPending.Provider value={homeTabPending}>
        <LinkLoaderReporter />
      </LinkPending.Provider>
      <IsLoaderShown />
    </LoaderProvider>
  );
}

describe('the loader', () => {
  let view: RenderResult;

  beforeEach(() => {
    view = render(<TwoLinks homeLinkPending={false} homeTabPending={true} />);
  });

  it('shows while a link is pending', () => {
    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent(
      'true'
    );
  });

  it('still shows when two links swap in a single update', () => {
    view.rerender(<TwoLinks homeLinkPending={true} homeTabPending={false} />);

    expect(screen.getByTestId(IS_LOADER_SHOWN_TEST_ID)).toHaveTextContent(
      'true'
    );
  });

  it('hides once the navigation has landed', () => {
    view.rerender(<TwoLinks homeLinkPending={false} homeTabPending={false} />);

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
