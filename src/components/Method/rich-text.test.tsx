import { render } from '@/test-utils/render';
import { emphasize } from './rich-text';

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
