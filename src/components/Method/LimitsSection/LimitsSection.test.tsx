import { render, screen } from '@/test-utils/render';
import { METHOD_SECTION_TEST_IDS } from '../MethodSection/constants';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY } from '../copy';
import { LimitsSection } from './LimitsSection';

const { limits } = METHOD_COPY;

describe('the section on what the method does not do', () => {
  beforeEach(() => {
    render(<LimitsSection />);
  });

  it('states every limit the copy carries, so none of them is quietly dropped', () => {
    const written = Object.values(limits).filter(
      (value) => typeof value === 'object'
    );
    const body = screen.getByTestId(
      METHOD_SECTION_TEST_IDS.body(SECTION_NUMBER.limits)
    );

    expect(body.querySelectorAll(':scope > p')).toHaveLength(written.length);
  });

  it('is the sixth section, the last thing the page says in its own voice', () => {
    expect(
      screen.getByTestId(METHOD_SECTION_TEST_IDS.numeral(SECTION_NUMBER.limits))
    ).toHaveTextContent(String(SECTION_NUMBER.limits));
  });
});
