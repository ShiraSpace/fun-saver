import { render, screen } from '@/test-utils/render';
import { MenuLabel } from './MenuLabel';

describe('MenuLabel', () => {
  it('renders its label text', () => {
    render(<MenuLabel>מראה</MenuLabel>);

    expect(screen.getByText('מראה')).toBeInTheDocument();
  });
});
