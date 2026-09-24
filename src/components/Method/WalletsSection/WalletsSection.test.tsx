import { render, screen } from '@/test-utils/render';
import { TALK_BUBBLE_TEST_IDS } from '../TalkBubble/constants';
import { WALLET_TRIO_TEST_IDS } from '../WalletTrio/constants';
import { WalletsSection } from './WalletsSection';

describe('the section on the three wallets', () => {
  beforeEach(() => {
    render(<WalletsSection />);
  });

  it('opens with the wallets, so the shape is seen before it is explained', () => {
    const trio = screen.getByTestId(WALLET_TRIO_TEST_IDS.trio);

    expect(trio.parentElement?.firstElementChild).toBe(trio);
  });

  it('carries the what-to-say line, the one script that lives outside section 5', () => {
    expect(screen.getByTestId(TALK_BUBBLE_TEST_IDS.bubble)).toBeInTheDocument();
  });
});
