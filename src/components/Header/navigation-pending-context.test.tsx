import { Context, JSX } from 'react';
import { render, screen, type RenderResult } from '@testing-library/react';
import {
  NavigationProvider,
  PendingNavigationReporter,
  useIsNavigating,
} from './navigation-pending-context';

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

const IS_NAVIGATING = 'is-navigating';

function IsNavigating(): JSX.Element {
  return (
    <output data-testid={IS_NAVIGATING}>{String(useIsNavigating())}</output>
  );
}

interface LinksProps {
  homeLinkPending: boolean;
  homeTabPending: boolean;
}

function TwoLinks({
  homeLinkPending,
  homeTabPending,
}: LinksProps): JSX.Element {
  return (
    <NavigationProvider>
      <LinkPending.Provider value={homeLinkPending}>
        <PendingNavigationReporter />
      </LinkPending.Provider>
      <LinkPending.Provider value={homeTabPending}>
        <PendingNavigationReporter />
      </LinkPending.Provider>
      <IsNavigating />
    </NavigationProvider>
  );
}

describe('pending navigations', () => {
  let view: RenderResult;

  beforeEach(() => {
    view = render(<TwoLinks homeLinkPending={false} homeTabPending={true} />);
  });

  it('is navigating while a link is pending', () => {
    expect(screen.getByTestId(IS_NAVIGATING)).toHaveTextContent('true');
  });

  it('is still navigating when two links swap in a single update', () => {
    view.rerender(<TwoLinks homeLinkPending={true} homeTabPending={false} />);

    expect(screen.getByTestId(IS_NAVIGATING)).toHaveTextContent('true');
  });

  it('stops navigating once the navigation has landed', () => {
    view.rerender(<TwoLinks homeLinkPending={false} homeTabPending={false} />);

    expect(screen.getByTestId(IS_NAVIGATING)).toHaveTextContent('false');
  });
});
