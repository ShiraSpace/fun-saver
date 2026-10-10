import { JSX } from 'react';
import { render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import { HOME_ROUTE } from '../Home/constants';
import { Header } from './Header';
import { HEADER_TEST_IDS } from './constants';
import { useReportPendingNavigation } from './navigation-pending-context';

const mockTitle = 'שלום';

interface PendingBesideHeaderProps {
  isPending: boolean;
}

function PendingBesideHeader({ isPending }: PendingBesideHeaderProps): null {
  useReportPendingNavigation(isPending);

  return null;
}

function HeaderWithPendingBeside({
  isPending,
}: PendingBesideHeaderProps): JSX.Element {
  return (
    <>
      <Header title={mockTitle} />
      <PendingBesideHeader isPending={isPending} />
    </>
  );
}

describe('the header loader', () => {
  it('runs while something beside the header is pending', () => {
    render(<HeaderWithPendingBeside isPending={true} />, {
      route: HOME_ROUTE,
      user: mockUser,
    });

    expect(screen.getByTestId(HEADER_TEST_IDS.progress)).toBeInTheDocument();
  });

  it('stays hidden while nothing is pending', () => {
    render(<HeaderWithPendingBeside isPending={false} />, {
      route: HOME_ROUTE,
      user: mockUser,
    });

    expect(
      screen.queryByTestId(HEADER_TEST_IDS.progress)
    ).not.toBeInTheDocument();
  });
});
