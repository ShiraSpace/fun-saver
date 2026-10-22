import { canAnimate, EASING } from '@/theme/motion';
import { PIGGY_BANK_SHAPE, PIGGY_BANK_SIZE } from '../PiggyBank/constants';
import { COIN_DROP } from './constants';

interface DropIntoSlotParams {
  coin: HTMLElement;
  whereThePiggyBankStands: HTMLElement | null;
  onLand: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface LayoutBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface DropPath {
  acrossToSlot: number;
  downToSlot: number;
  coinHeight: number;
}

function whereItStands(element: HTMLElement): LayoutBox {
  const standsIn = element.offsetParent ?? document.body;
  const standsInBox = standsIn.getBoundingClientRect();

  return {
    left: standsInBox.left + standsIn.clientLeft + element.offsetLeft,
    top: standsInBox.top + standsIn.clientTop + element.offsetTop,
    width: element.offsetWidth,
    height: element.offsetHeight,
  };
}

function slotCentreOf(whereThePiggyBankStands: HTMLElement): Point {
  const { slot } = PIGGY_BANK_SHAPE;
  const piggyBankBox = whereItStands(whereThePiggyBankStands);
  const drawnPerUnit = piggyBankBox.width / PIGGY_BANK_SIZE.width;

  return {
    x: piggyBankBox.left + (slot.x + slot.width / 2) * drawnPerUnit,
    y: piggyBankBox.top + (slot.y + slot.height / 2) * drawnPerUnit,
  };
}

function dropPathOf(coin: HTMLElement, whereThePiggyBankStands: HTMLElement): DropPath {
  const coinBox = whereItStands(coin);
  const slotCentre = slotCentreOf(whereThePiggyBankStands);

  return {
    acrossToSlot: slotCentre.x - (coinBox.left + coinBox.width / 2),
    downToSlot: slotCentre.y - (coinBox.top + coinBox.height),
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

export function dropIntoSlot({ coin, whereThePiggyBankStands, onLand }: DropIntoSlotParams): void {
  if (!whereThePiggyBankStands || !canAnimate()) {
    onLand();
    return;
  }

  const drop = coin.animate(dropKeyframes(dropPathOf(coin, whereThePiggyBankStands)), {
    duration: COIN_DROP.durationMs,
    fill: 'forwards',
    composite: 'add',
  });

  drop.onfinish = onLand;
}
