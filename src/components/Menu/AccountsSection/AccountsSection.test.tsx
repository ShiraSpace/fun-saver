import { render, screen } from '@/test-support/render';
import { AccountsSection } from './AccountsSection';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_TEST_IDS,
} from './constants';

describe('AccountsSection', () => {
  beforeEach(() => {
    render(<AccountsSection />);
  });

  it('renders a chip per account marking the selected one', () => {
    const chips = screen.getAllByTestId(ACCOUNTS_SECTION_TEST_IDS.chip);
    expect(chips).toHaveLength(ACCOUNTS_SECTION_CONTENT.accounts.length);

    expect(chips[0]).toHaveAttribute('data-selected', 'true');
    expect(chips[0]).toHaveTextContent('נ');
    expect(chips[1]).toHaveAttribute('data-selected', 'false');
    expect(chips[1]).toHaveTextContent('מ');
  });

  it('renders edit and add action chips', () => {
    expect(
      screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.editChip)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.addChip)
    ).toBeInTheDocument();
  });
});
