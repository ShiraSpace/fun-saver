import { render, screen } from '@/test-support/render';
import { NameField } from './NameField';
import { NAME_FIELD_COPY, NAME_FIELD_TEST_IDS } from './constants';

describe('NameField', () => {
  beforeEach(() => {
    render(<NameField />);
  });

  it('renders the name input', () => {
    expect(screen.getByTestId(NAME_FIELD_TEST_IDS.input)).toBeInTheDocument();
  });

  it('labels the input', () => {
    expect(screen.getByTestId(NAME_FIELD_TEST_IDS.label)).toHaveTextContent(
      NAME_FIELD_COPY.label
    );
  });
});
