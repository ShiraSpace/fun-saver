import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '@/test-utils/render';
import { hexToRgb } from '@/test-utils/css-color';
import { getThemeTokens } from '@/theme/registry';
import { mockDerivedAccount } from '@/test-utils/fixtures';
import { AppearanceSection } from './AppearanceSection';
import {
  APPEARANCE_SECTION_CONTENT,
  APPEARANCE_SECTION_TEST_IDS,
} from './constants';
import { mockRouter } from '@mocks/next/navigation';

function renderSection(): void {
  render(<AppearanceSection />, {
    accounts: {
      accounts: [mockDerivedAccount],
      currentAccount: mockDerivedAccount,
      selectAccount: jest.fn(),
    },
  });
}

function swatches(): HTMLElement[] {
  return screen.getAllByTestId(APPEARANCE_SECTION_TEST_IDS.swatch);
}

describe('AppearanceSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockDerivedAccount });
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
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  describe('when the save fails', () => {
    let error: HTMLElement;

    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      renderSection();

      fireEvent.click(swatches()[1]);

      error = await screen.findByTestId(APPEARANCE_SECTION_TEST_IDS.saveError);
    });

    it('tells the user it did not save', () => {
      expect(error).toHaveTextContent(APPEARANCE_SECTION_CONTENT.saveError);
    });

    it('speaks it in the alert red', () => {
      expect(getComputedStyle(error).color).toBe(
        hexToRgb(getThemeTokens().colors.alertText)
      );
    });

    it('reverts to the theme that is still saved', () => {
      expect(swatches()[0]).toHaveAttribute('data-selected', 'true');
      expect(swatches()[1]).toHaveAttribute('data-selected', 'false');
      expect(mockRouter.refresh).not.toHaveBeenCalled();
    });
  });
});
