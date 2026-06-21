import { fireEvent, render, screen } from '@/test-support/render';
import { MenuOverlay } from './MenuOverlay';
import { MENU_OVERLAY_CONTENT, MENU_OVERLAY_TEST_IDS } from './constants';

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

  it('calls onClose when the close button is clicked', () => {
    let closed = false;
    render(
      <MenuOverlay
        isOpen
        onClose={(): void => {
          closed = true;
        }}
      />
    );

    fireEvent.click(screen.getByTestId(MENU_OVERLAY_TEST_IDS.closeButton));

    expect(closed).toBe(true);
  });
});
