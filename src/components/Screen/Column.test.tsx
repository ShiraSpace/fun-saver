import { render, screen } from '@/test-utils/render';
import { Account } from '@/components/Account';
import { Method } from '@/components/Method';
import { Content } from '@/components/Menu/MenuOverlay/MenuOverlay.styles';
import { HEADER_TEST_IDS } from '@/components/Header/constants';
import { METHOD_ROUTE } from '@/components/Method/constants';
import {
  mockAccountsContext,
  mockDerivedAccount,
  mockSecondDerivedAccount,
  mockUser,
} from '@/test-utils/fixtures';
import { Column } from './Column';

interface ColumnShape {
  boxSizing: string;
  maxWidth: string;
  marginInline: string;
  paddingLeft: string;
  paddingRight: string;
}

const REFERENCE = 'reference-column';
const MENU_COLUMN = 'menu-column';

function shapeOf(element: HTMLElement): ColumnShape {
  const { boxSizing, maxWidth, marginInline, paddingLeft, paddingRight } =
    getComputedStyle(element);

  return { boxSizing, maxWidth, marginInline, paddingLeft, paddingRight };
}

function referenceElement(): HTMLElement {
  return screen.getByTestId(REFERENCE);
}

function pageColumn(): HTMLElement {
  const column = screen.getByTestId(HEADER_TEST_IDS.bar).parentElement;

  if (!column) {
    throw new Error('the header rendered outside any column');
  }

  return column;
}

describe('the page column', () => {
  let reference: ColumnShape;

  beforeEach(() => {
    render(<Column data-testid={REFERENCE} />);
    reference = shapeOf(referenceElement());
  });

  it('holds the account page', () => {
    render(<Account account={mockDerivedAccount} />, {
      accounts: mockAccountsContext,
      user: mockUser,
    });

    expect(shapeOf(pageColumn())).toEqual(reference);
  });

  it('holds the method page', () => {
    render(
      <Method
        accounts={[mockDerivedAccount, mockSecondDerivedAccount]}
        initialAccount={mockDerivedAccount}
      />,
      { route: METHOD_ROUTE, user: mockUser }
    );

    expect(shapeOf(pageColumn())).toEqual(reference);
  });

  it('holds the menu, which floats over both of them', () => {
    render(<Content data-testid={MENU_COLUMN} />);

    expect(shapeOf(screen.getByTestId(MENU_COLUMN))).toEqual(reference);
  });

  it('centres itself in a window wider than the cap', () => {
    expect(reference.marginInline).toBe('auto');
  });

  it('fills a window narrower than the cap', () => {
    expect(getComputedStyle(referenceElement()).width).toBe('100%');
  });

  it('keeps its padding inside the cap rather than beside it', () => {
    expect(reference.boxSizing).toBe('border-box');
  });
});
