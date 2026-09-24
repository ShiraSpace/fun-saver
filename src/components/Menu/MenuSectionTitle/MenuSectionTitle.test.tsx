import { render, screen } from '@/test-utils/render';
import { MenuSectionTitle } from './MenuSectionTitle';

describe('MenuSectionTitle', () => {
  it('renders its label text', () => {
    render(<MenuSectionTitle>מראה</MenuSectionTitle>);

    expect(screen.getByText('מראה')).toBeInTheDocument();
  });
});
