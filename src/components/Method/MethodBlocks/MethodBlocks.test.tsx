import { render, screen } from '@/test-utils/render';
import type { MethodBlock } from '../copy';
import { EVIDENCE_QUOTE_TEST_IDS } from '../EvidenceQuote/constants';
import { TALK_BUBBLE_TEST_IDS } from '../TalkBubble/constants';
import { MethodBlocks } from './MethodBlocks';

describe('the block renderer', () => {
  describe('given a text block of two paragraphs', () => {
    const BLOCK: MethodBlock = {
      kind: 'text',
      body: 'פסקה **ראשונה**\n\nפסקה שנייה',
    };
    let container: HTMLElement;

    beforeEach(() => {
      container = render(<MethodBlocks blocks={[BLOCK]} />).container;
    });

    it('splits it into sibling paragraphs, the only shape the section styles reach', () => {
      expect(container.querySelectorAll(':scope > p')).toHaveLength(2);
    });

    it('leaves no emphasis markers on the page', () => {
      expect(container).toHaveTextContent('פסקה ראשונה');
    });
  });

  describe('given a muted text block', () => {
    const BLOCK: MethodBlock = {
      kind: 'text',
      muted: true,
      body: 'הסתייגות',
    };
    let container: HTMLElement;

    beforeEach(() => {
      container = render(<MethodBlocks blocks={[BLOCK]} />).container;
    });

    it('carries the flag onto the paragraph rather than dropping the block', () => {
      expect(container.querySelectorAll('[data-muted="true"]')).toHaveLength(1);
    });
  });

  describe('given a heading block', () => {
    const BLOCK: MethodBlock = { kind: 'heading', body: 'השיחה הראשונה' };
    let container: HTMLElement;

    beforeEach(() => {
      container = render(<MethodBlocks blocks={[BLOCK]} />).container;
    });

    it('raises it to a direct h3, so the section keeps an outline and the body rule reaches it', () => {
      expect(container.querySelectorAll(':scope > h3')).toHaveLength(1);
    });
  });

  describe('given the mix section 2 actually carries', () => {
    const BLOCKS: readonly MethodBlock[] = [
      { kind: 'text', body: 'גוף' },
      { kind: 'quote', body: 'ממצא', citation: 'Aknin, PLoS ONE, 2012' },
      {
        kind: 'talk',
        label: 'מה אומרים לילד',
        lines: [{ tone: 'spoken', text: 'משפט' }],
      },
    ];

    beforeEach(() => {
      render(<MethodBlocks blocks={BLOCKS} />);
    });

    it('hands the quote to the evidence quote rather than rendering it as prose', () => {
      expect(
        screen.getByTestId(EVIDENCE_QUOTE_TEST_IDS.quote)
      ).toBeInTheDocument();
    });

    it('hands the talk to the bubble, so the two never look alike while scanning', () => {
      expect(
        screen.getByTestId(TALK_BUBBLE_TEST_IDS.bubble)
      ).toBeInTheDocument();
    });
  });
});
