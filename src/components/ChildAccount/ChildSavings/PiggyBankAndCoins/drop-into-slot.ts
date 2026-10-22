import { canAnimate, EASING } from '@/theme/motion';
import { PIGGY_BANK_SHAPE } from '../PiggyBank/constants';
import { COIN_DROP } from './constants';

interface DropIntoSlotParams {
  coin: HTMLElement;
  piggyBank: SVGSVGElement | null;
  onLand: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface DropPath {
  acrossToSlot: number;
  downToSlot: number;
  coinHeight: number;
}

function slotCentreOf(piggyBank: SVGSVGElement): Point {
  const { slot } = PIGGY_BANK_SHAPE;
  const piggyBankBox = piggyBank.getBoundingClientRect();
  const drawnPerViewBoxUnit = piggyBankBox.width / piggyBank.viewBox.baseVal.width;

  return {
    x: piggyBankBox.left + (slot.x + slot.width / 2) * drawnPerViewBoxUnit,
    y: piggyBankBox.top + (slot.y + slot.height / 2) * drawnPerViewBoxUnit,
  };
}

function dropPathOf(coin: HTMLElement, piggyBank: SVGSVGElement): DropPath {
  const coinBox = coin.getBoundingClientRect();
  const slotCentre = slotCentreOf(piggyBank);

  return {
    acrossToSlot: slotCentre.x - (coinBox.left + coinBox.width / 2),
    downToSlot: slotCentre.y - coinBox.bottom,
    coinHeight: coinBox.height,
  };
}

function dropKeyframes({ acrossToSlot, downToSlot, coinHeight }: DropPath): Keyframe[] {
  const { wholeCoinShowing, goneThroughTheSlot, whereItWasTapped } = COIN_DROP;
  const edgeOn = `scaleX(${COIN_DROP.edgeOnWidth})`;

  return [
    { transform: whereItWasTapped, clipPath: wholeCoinShowing, offset: 0 },
    {
      transform: `translate(${acrossToSlot}px, ${downToSlot - COIN_DROP.hoverAboveSlotPx}px)`,
      clipPath: wholeCoinShowing,
      offset: COIN_DROP.overTheSlotAt,
      easing: EASING.easeInOut,
    },
    {
      transform: `translate(${acrossToSlot}px, ${downToSlot - COIN_DROP.edgeOnAboveSlotPx}px) ${edgeOn}`,
      clipPath: wholeCoinShowing,
      offset: COIN_DROP.edgeOnAt,
      easing: EASING.easeIn,
    },
    {
      transform: `translate(${acrossToSlot}px, ${downToSlot + coinHeight}px) ${edgeOn}`,
      clipPath: goneThroughTheSlot,
      offset: 1,
    },
  ];
}

function settleWhereItStands(coin: HTMLElement): void {
  coin.getAnimations().forEach((animation) => animation.finish());
}

export function dropIntoSlot({ coin, piggyBank, onLand }: DropIntoSlotParams): void {
  if (!piggyBank || !canAnimate()) {
    onLand();
    return;
  }

  settleWhereItStands(coin);

  const drop = coin.animate(dropKeyframes(dropPathOf(coin, piggyBank)), {
    duration: COIN_DROP.durationMs,
    fill: 'forwards',
  });

  drop.onfinish = onLand;
}
