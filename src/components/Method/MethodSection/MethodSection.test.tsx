import { render, screen } from '@/test-utils/render';
import { MethodSection } from './MethodSection';
import { METHOD_SECTION_TEST_IDS } from './constants';

describe('a method section', () => {
  const NUMBER = 1;
  const TITLE = 'למה לא קופה אחת';
  const BODY = 'גוף הסעיף';

  describe('as the page first renders it', () => {
    beforeEach(() => {
      render(
        <MethodSection number={NUMBER} title={TITLE}>
          {BODY}
        </MethodSection>
      );
    });

    it('starts closed, so six sections read as a list rather than a wall', () => {
      expect(
        screen.getByTestId(METHOD_SECTION_TEST_IDS.section(NUMBER))
      ).not.toHaveAttribute('open');
    });

    it('holds its children in the body its own prose rules hang off', () => {
      expect(
        screen.getByTestId(METHOD_SECTION_TEST_IDS.body(NUMBER))
      ).toHaveTextContent(BODY);
    });

    it('shows no hint chip when the section was given none', () => {
      expect(
        screen.queryByTestId(METHOD_SECTION_TEST_IDS.hint(NUMBER))
      ).not.toBeInTheDocument();
    });
  });

  describe('when the section carries a hint', () => {
    const HINT = 'הכי חשוב';

    beforeEach(() => {
      render(
        <MethodSection number={NUMBER} title={TITLE} hint={HINT}>
          {BODY}
        </MethodSection>
      );
    });

    it('puts it on the summary row, the only place a closed section can say it', () => {
      expect(
        screen.getByTestId(METHOD_SECTION_TEST_IDS.hint(NUMBER))
      ).toHaveTextContent(HINT);
    });
  });
});
