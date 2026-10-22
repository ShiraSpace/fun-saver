import { render, screen } from '@/test-utils/render';
import { elementsCanAnimate } from '@/test-utils/motion';
import { PiggyBank } from '../PiggyBank';
import { PIGGY_BANK_TEST_IDS } from '../PiggyBank/constants';
import { dropIntoSlot } from './drop-into-slot';

it('finishes a slide still running on the coin before dropping it', () => {
  const mockSlide = { finish: jest.fn() };
  const mockCoin = document.createElement('button');
  const mockOnLand = jest.fn();
  elementsCanAnimate();
  mockCoin.getAnimations = (): Animation[] => [mockSlide as unknown as Animation];
  render(<PiggyBank piggyBankFill={0} />);

  dropIntoSlot({
    coin: mockCoin,
    piggyBank: screen.getByTestId<SVGSVGElement & HTMLElement>(PIGGY_BANK_TEST_IDS.art),
    onLand: mockOnLand,
  });

  expect(mockSlide.finish).toHaveBeenCalled();
});
