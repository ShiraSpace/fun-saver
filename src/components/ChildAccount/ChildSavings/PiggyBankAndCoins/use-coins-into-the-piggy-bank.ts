'use client';

import { RefObject, useEffect, useRef } from 'react';
import { breathe, wiggleThenBreathe } from '../PiggyBank';
import { dropIntoSlot } from './drop-into-slot';

interface CoinsIntoThePiggyBankParams {
  onCollect: (place: number) => void;
  onLand: (place: number) => void;
}

interface CoinsIntoThePiggyBank {
  piggyBankElement: RefObject<SVGSVGElement | null>;
  whereThePiggyBankStands: RefObject<HTMLDivElement | null>;
  collectAndDrop: (place: number, tappedCoin: HTMLElement) => void;
}

export function useCoinsIntoThePiggyBank({
  onCollect,
  onLand,
}: CoinsIntoThePiggyBankParams): CoinsIntoThePiggyBank {
  const piggyBankElement = useRef<SVGSVGElement>(null);
  const whereThePiggyBankStands = useRef<HTMLDivElement>(null);

  useEffect((): void => breathe(piggyBankElement.current), []);

  const collectAndDrop = (place: number, tappedCoin: HTMLElement): void => {
    onCollect(place);
    dropIntoSlot({
      coin: tappedCoin,
      whereThePiggyBankStands: whereThePiggyBankStands.current,
      onLand: (): void => {
        onLand(place);
        wiggleThenBreathe(piggyBankElement.current);
      },
    });
  };

  return { piggyBankElement, whereThePiggyBankStands, collectAndDrop };
}
