import { render, screen } from '@/test-utils/render';
import { LanguageSection } from './LanguageSection';
import { LANGUAGE_SECTION_COPY, LANGUAGE_SECTION_TEST_IDS } from './constants';

describe('LanguageSection', () => {
  beforeEach(() => {
    render(<LanguageSection />);
  });

  it('renders a segment per language marking the selected one', () => {
    const options = screen.getAllByTestId(LANGUAGE_SECTION_TEST_IDS.option);

    expect(options).toHaveLength(LANGUAGE_SECTION_COPY.options.length);
    expect(options[0]).toHaveAttribute('data-selected', 'true');
    expect(options[0]).toHaveTextContent('עברית');
    expect(options[1]).toHaveAttribute('data-selected', 'false');
    expect(options[1]).toHaveTextContent('EN');
  });
});
