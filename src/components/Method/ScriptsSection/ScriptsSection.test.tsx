import { render, screen } from '@/test-utils/render';
import { METHOD_SECTION_TEST_IDS } from '../MethodSection/constants';
import { TALK_BUBBLE_TEST_IDS } from '../TalkBubble/constants';
import { SECTION_NUMBER } from '../constants';
import { METHOD_COPY } from '../copy';
import { ScriptsSection } from './ScriptsSection';

const { scripts } = METHOD_COPY;

const HEADING = 'heading';
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
    node.tagName === 'H3' ? HEADING : BUBBLE
  );
}

describe('the section on what to say to the child', () => {
  beforeEach(() => {
    render(<ScriptsSection />);
  });

  it('names every moment and then gives the words for it, and adds nothing between', () => {
    expect(headingsAndBubbles()).toEqual(
      scripts.moments.flatMap(() => [HEADING, BUBBLE])
    );
  });

  it('opens on the line the copy gives it, and says nothing of its own', () => {
    const paragraphs = sectionBody().querySelectorAll(':scope > p');

    expect(
      Array.from(paragraphs).map((paragraph) =>
        paragraph.getAttribute('data-muted')
      )
    ).toEqual(['true']);
  });

  it('keeps every moment named like a heading, which a wrapper around it would quietly undo', () => {
    expect(sectionBody().querySelectorAll(':scope > h3')).toHaveLength(
      scripts.moments.length
    );
  });
});
