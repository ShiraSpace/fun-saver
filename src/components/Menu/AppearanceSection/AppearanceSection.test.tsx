import { fireEvent, screen } from '@testing-library/react';
import { render } from '@/test-support/render';
import { AppearanceSection } from './AppearanceSection';
import {
  APPEARANCE_SECTION_CONTENT,
  APPEARANCE_SECTION_TEST_IDS,
} from './constants';

describe('AppearanceSection', () => {
  beforeEach(() => {
    render(<AppearanceSection />);
  });

  it('renders a swatch per theme', () => {
    const swatches = screen.getAllByTestId(APPEARANCE_SECTION_TEST_IDS.swatch);
    expect(swatches).toHaveLength(APPEARANCE_SECTION_CONTENT.themes.length);
  });

  it('marks the initial theme as selected', () => {
    const swatches = screen.getAllByTestId(APPEARANCE_SECTION_TEST_IDS.swatch);
    expect(swatches[0]).toHaveAttribute('data-selected', 'true');
    expect(swatches[1]).toHaveAttribute('data-selected', 'false');
    expect(swatches[2]).toHaveAttribute('data-selected', 'false');
  });

  it('switches selection when a swatch is clicked', () => {
    const swatches = screen.getAllByTestId(APPEARANCE_SECTION_TEST_IDS.swatch);
    fireEvent.click(swatches[1]);
    expect(swatches[0]).toHaveAttribute('data-selected', 'false');
    expect(swatches[1]).toHaveAttribute('data-selected', 'true');
    expect(swatches[2]).toHaveAttribute('data-selected', 'false');
  });
});
