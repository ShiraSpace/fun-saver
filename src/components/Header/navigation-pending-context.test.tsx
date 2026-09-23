import { Context, JSX, useState } from 'react';
import { render, screen, type RenderResult } from '@testing-library/react';
import {
  PendingLinksProvider,
  PendingNavigationReporter,
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

const PENDING_COUNT = 'pending-count';

interface LinksProps {
  homeLinkPending: boolean;
  homeTabPending: boolean;
}

function TwoLinks({
  homeLinkPending,
  homeTabPending,
}: LinksProps): JSX.Element {
  const [pendingLinks, setPendingLinks] = useState(0);

  return (
    <PendingLinksProvider value={setPendingLinks}>
      <LinkPending.Provider value={homeLinkPending}>
        <PendingNavigationReporter />
      </LinkPending.Provider>
      <LinkPending.Provider value={homeTabPending}>
        <PendingNavigationReporter />
      </LinkPending.Provider>
      <output data-testid={PENDING_COUNT}>{pendingLinks}</output>
    </PendingLinksProvider>
  );
}

describe('counting pending links', () => {
  let view: RenderResult;

  beforeEach(() => {
    view = render(<TwoLinks homeLinkPending={false} homeTabPending={true} />);
  });

  it('counts the link that is pending', () => {
    expect(screen.getByTestId(PENDING_COUNT)).toHaveTextContent('1');
  });

  it('still counts one when two links swap in a single update', () => {
    view.rerender(<TwoLinks homeLinkPending={true} homeTabPending={false} />);

    expect(screen.getByTestId(PENDING_COUNT)).toHaveTextContent('1');
  });

  it('counts none once the navigation has landed', () => {
    view.rerender(<TwoLinks homeLinkPending={false} homeTabPending={false} />);

    expect(screen.getByTestId(PENDING_COUNT)).toHaveTextContent('0');
  });
});
