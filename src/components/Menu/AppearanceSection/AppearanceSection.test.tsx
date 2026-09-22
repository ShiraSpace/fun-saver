import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '@/test-utils/render';
import { AccountsProvider } from '@/components/Home/accounts-context';
import { mockAccount, mockDerivedAccount } from '@/test-utils/fixtures';
import { AppearanceSection } from './AppearanceSection';
import {
  APPEARANCE_SECTION_CONTENT,
  APPEARANCE_SECTION_TEST_IDS,
} from './constants';

const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: (): { refresh: jest.Mock } => ({ refresh: mockRefresh }),
}));

function renderSection(): void {
  render(
    <AccountsProvider
      value={{
        accounts: [mockDerivedAccount],
        currentAccount: mockDerivedAccount,
        selectAccount: jest.fn(),
      }}
    >
      <AppearanceSection />
    </AccountsProvider>
  );
}

function swatches(): HTMLElement[] {
  return screen.getAllByTestId(APPEARANCE_SECTION_TEST_IDS.swatch);
}

describe('AppearanceSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockAccount });
  });

  it('renders a swatch per theme', () => {
    renderSection();

    expect(swatches()).toHaveLength(APPEARANCE_SECTION_CONTENT.themes.length);
  });

  it('marks the active theme as selected', () => {
    renderSection();

    expect(swatches()[0]).toHaveAttribute('data-selected', 'true');
    expect(swatches()[1]).toHaveAttribute('data-selected', 'false');
  });

  describe('when a swatch is chosen', () => {
    const chosenTheme = APPEARANCE_SECTION_CONTENT.themes[1];

    beforeEach(async () => {
      renderSection();
      fireEvent.click(swatches()[1]);

      await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    });

    it('applies the chosen theme', () => {
      expect(swatches()[1]).toHaveAttribute('data-selected', 'true');
      expect(swatches()[0]).toHaveAttribute('data-selected', 'false');
    });

    it('saves it on the selected account', () => {
      const accountThemeUrl = `/api/accounts/${mockDerivedAccount.id}/theme`;
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];

      expect(url).toBe(accountThemeUrl);
      expect(options.method).toBe('PUT');
      expect(JSON.parse(options.body)).toEqual({ themeId: chosenTheme.id });
    });

    it('refreshes so the saved theme survives a later switch', () => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('reverts and shows an error when the save fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });
    renderSection();

    fireEvent.click(swatches()[1]);

    await waitFor(() =>
      expect(
        screen.getByTestId(APPEARANCE_SECTION_TEST_IDS.saveError)
      ).toHaveTextContent(APPEARANCE_SECTION_CONTENT.saveError)
    );
    expect(swatches()[0]).toHaveAttribute('data-selected', 'true');
    expect(swatches()[1]).toHaveAttribute('data-selected', 'false');
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
