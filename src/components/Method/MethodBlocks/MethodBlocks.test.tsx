import { render, screen } from '@/test-utils/render';
import type { MethodBlock } from '../copy';
import { EVIDENCE_QUOTE_TEST_IDS } from '../EvidenceQuote/constants';
import { SOURCE_MARKER_TEST_IDS } from '../SourceMarker/constants';
import { TALK_BUBBLE_TEST_IDS } from '../TalkBubble/constants';
import { METHOD_COPY } from '../copy';
import { MethodBlocks } from './MethodBlocks';

describe('what a section says, written out from the copy', () => {
  describe('given a text block of two paragraphs', () => {
    const mockBlock: MethodBlock = {
      kind: 'text',
      body: 'פסקה **ראשונה**\n\nפסקה שנייה',
    };
    let container: HTMLElement;

    beforeEach(() => {
      container = render(<MethodBlocks blocks={[mockBlock]} />).container;
    });

    it('breaks where the writer left a blank line, so an argument reads as steps', () => {
      expect(container.querySelectorAll(':scope > p')).toHaveLength(2);
    });

    it('leaves no emphasis markers on the page', () => {
      expect(container).toHaveTextContent('פסקה ראשונה');
    });
  });

  describe('given a muted text block', () => {
    const mockBlock: MethodBlock = {
      kind: 'text',
      muted: true,
      body: 'הסתייגות',
    };
    let container: HTMLElement;

    beforeEach(() => {
      container = render(<MethodBlocks blocks={[mockBlock]} />).container;
    });

    it('keeps a muted remark muted, rather than levelling it with what surrounds it', () => {
      expect(container.querySelectorAll('[data-muted="true"]')).toHaveLength(1);
    });
  });

  describe('given a heading block', () => {
    const mockBlock: MethodBlock = { kind: 'heading', body: 'השיחה הראשונה' };
    let container: HTMLElement;

    beforeEach(() => {
      container = render(<MethodBlocks blocks={[mockBlock]} />).container;
    });

    it('gives a heading the weight of a heading, which a wrapper around it would quietly undo', () => {
      expect(container.querySelectorAll(':scope > h3')).toHaveLength(1);
    });
  });

  describe('given the mix section 2 actually carries', () => {
    const mockBlocks: readonly MethodBlock[] = [
      { kind: 'text', body: 'גוף' },
      { kind: 'quote', body: 'ממצא', citation: 'Aknin, PLoS ONE, 2012' },
      {
        kind: 'talk',
        label: 'מה אומרים לילד',
        lines: [{ tone: 'spoken', text: 'משפט' }],
      },
    ];

    beforeEach(() => {
      render(<MethodBlocks blocks={mockBlocks} />);
    });

    it('sets a study apart from the prose, so neither is mistaken for the other', () => {
      expect(
        screen.getByTestId(EVIDENCE_QUOTE_TEST_IDS.quote)
      ).toBeInTheDocument();
    });

    it('sets what to say to the child apart from a study, so the two never blur while scanning', () => {
      expect(
        screen.getByTestId(TALK_BUBBLE_TEST_IDS.bubble)
      ).toBeInTheDocument();
    });
  });

  describe('given a two-paragraph block and the source behind it', () => {
    const mockBlock: MethodBlock = {
      kind: 'text',
      sources: [METHOD_COPY.sources.list[0].id],
      body: 'הטענה\n\nוההסבר שאחריה',
    };
    let container: HTMLElement;

    beforeEach(() => {
      container = render(<MethodBlocks blocks={[mockBlock]} />).container;
    });

    it('gives the claim one number, however many paragraphs it runs to', () => {
      expect(screen.getAllByTestId(SOURCE_MARKER_TEST_IDS.marker)).toHaveLength(
        1
      );
    });

    it('puts it at the end of the claim, where a citation belongs, and not mid-thought', () => {
      const paragraphs = container.querySelectorAll(':scope > p');

      expect(paragraphs[paragraphs.length - 1]).toContainElement(
        screen.getByTestId(SOURCE_MARKER_TEST_IDS.marker)
      );
    });
  });
});
