import { fireEvent, render, screen } from '@/test-support/render';
import { MenuOverlay } from './MenuOverlay';
import { MENU_OVERLAY_CONTENT } from './constants';

describe('MenuOverlay', () => {
  it('exposes the overlay as a labelled dialog', () => {
    render(<MenuOverlay isOpen onClose={(): void => {}} />);

    expect(
      screen.getByRole('dialog', { name: MENU_OVERLAY_CONTENT.title })
    ).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed while open', () => {
    let closed = false;
    render(
      <MenuOverlay
        isOpen
        onClose={(): void => {
          closed = true;
        }}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(closed).toBe(true);
  });
});
