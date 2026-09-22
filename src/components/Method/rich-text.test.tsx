import { render } from '@/test-utils/render';
import { emphasize, paragraphs } from './rich-text';

describe('emphasis in the method copy', () => {
  const MARKED = 'המטרה היא **תרגול שבועי** בדחיית סיפוקים';
  let container: HTMLElement;

  beforeEach(() => {
    ({ container } = render(<p>{emphasize(MARKED)}</p>));
  });

  it('lifts the marked run into its own strong, so a claim can carry weight mid-sentence', () => {
    expect(container.querySelector('strong')).toHaveTextContent('תרגול שבועי');
  });

  it('leaves no markers behind for the parent to read', () => {
    expect(container).toHaveTextContent('המטרה היא תרגול שבועי בדחיית סיפוקים');
  });
});

describe('paragraph breaks in the method copy', () => {
  it('keeps a body with no break whole, which is what most blocks are', () => {
    expect(paragraphs('כשכל הכסף יושב במספר אחד')).toHaveLength(1);
  });

  it('breaks a body where the deck left a blank line, so an argument reads as steps', () => {
    expect(paragraphs('אין מה ללמוד ממנו\n\nכל שקל מקבל תפקיד')).toHaveLength(
      2
    );
  });
});
