import { render, screen } from '@/test-utils/render';
import { METHOD_SECTION_TEST_IDS } from '../MethodSection/constants';
import { TALK_BUBBLE_TEST_IDS } from '../TalkBubble/constants';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY } from '../copy';
import { ScriptsSection } from './ScriptsSection';

const { scripts } = METHOD_COPY;

const IN_ORDER = [
  scripts.first,
  scripts.ranOut,
  scripts.wantsSavings,
  scripts.interest,
];

const BUBBLE = 'bubble';

function sectionBody(): HTMLElement {
  return screen.getByTestId(
    METHOD_SECTION_TEST_IDS.body(SECTION_NUMBER.scripts)
  );
}

function headingsAndBubbles(): string[] {
  const nodes = sectionBody().querySelectorAll(
    `h3, [data-testid="${TALK_BUBBLE_TEST_IDS.bubble}"]`
  );

  return Array.from(nodes).map((node) =>
    node.tagName === 'H3' ? (node.textContent ?? '') : BUBBLE
  );
}

describe('the section on what to say to the child', () => {
  beforeEach(() => {
    render(<ScriptsSection />);
  });

  it('heads every bubble with the moment it is for, so a parent mid-argument finds theirs', () => {
    expect(headingsAndBubbles()).toEqual(
      IN_ORDER.flatMap((script) => [script.heading.body, BUBBLE])
    );
  });

  it('opens on the muted line from the copy and writes no prose of its own', () => {
    const paragraphs = sectionBody().querySelectorAll(':scope > p');

    expect(
      Array.from(paragraphs).map((paragraph) =>
        paragraph.getAttribute('data-muted')
      )
    ).toEqual(['true']);
  });

  it('leaves every heading a direct child, the only place the body rule reaches', () => {
    expect(sectionBody().querySelectorAll(':scope > h3')).toHaveLength(
      IN_ORDER.length
    );
  });
});
