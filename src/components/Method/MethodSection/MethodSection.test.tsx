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
        <MethodSection id={NUMBER} number={NUMBER} title={TITLE}>
          {BODY}
        </MethodSection>
      );
    });

    it('starts closed, so six sections read as a list rather than a wall', () => {
      expect(
        screen.getByTestId(METHOD_SECTION_TEST_IDS.section(NUMBER))
      ).not.toHaveAttribute('open');
    });

    it('shows what the section has to say once the parent opens it', () => {
      expect(
        screen.getByTestId(METHOD_SECTION_TEST_IDS.body(NUMBER))
      ).toHaveTextContent(BODY);
    });

    it('says nothing extra on the row when there is nothing extra to say', () => {
      expect(
        screen.queryByTestId(METHOD_SECTION_TEST_IDS.hint(NUMBER))
      ).not.toBeInTheDocument();
    });
  });

  describe('when the section carries a hint', () => {
    const HINT = 'הכי חשוב';

    beforeEach(() => {
      render(
        <MethodSection id={NUMBER} number={NUMBER} title={TITLE} hint={HINT}>
          {BODY}
        </MethodSection>
      );
    });

    it('puts it on the row itself, the only thing a shut section can tell the parent', () => {
      expect(
        screen.getByTestId(METHOD_SECTION_TEST_IDS.hint(NUMBER))
      ).toHaveTextContent(HINT);
    });
  });

  describe('when the section is not one of the numbered steps', () => {
    const ID = 'sources';

    beforeEach(() => {
      render(
        <MethodSection id={ID} title={TITLE}>
          {BODY}
        </MethodSection>
      );
    });

    it('shows no number, so the six steps a parent has to follow stay six', () => {
      expect(
        screen.queryByTestId(METHOD_SECTION_TEST_IDS.numeral(ID))
      ).not.toBeInTheDocument();
    });

    it('still shows what it holds, so it is not a heading with nothing under it', () => {
      expect(
        screen.getByTestId(METHOD_SECTION_TEST_IDS.body(ID))
      ).toHaveTextContent(BODY);
    });
  });
});
