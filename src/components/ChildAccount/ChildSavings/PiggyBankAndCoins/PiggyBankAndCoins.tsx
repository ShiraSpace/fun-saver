'use client';

import { JSX, RefObject, useEffect, useRef } from 'react';
import { InterestCoins, type InterestCoin } from '../InterestCoins';
import { breathe, PiggyBank, wiggleThenBreathe } from '../PiggyBank';
import { dropIntoSlot } from './drop-into-slot';
import { PiggyBankSpace } from './PiggyBankAndCoins.styles';

interface PiggyBankAndCoinsProps {
  interestCoins: InterestCoin[];
  piggyBankFill: number;
  onCollect: (place: number) => void;
  onLand: (place: number) => void;
  whereFocusGoesLast: RefObject<HTMLElement | null>;
}

export function PiggyBankAndCoins({
  interestCoins,
  piggyBankFill,
  onCollect,
  onLand,
  whereFocusGoesLast,
}: PiggyBankAndCoinsProps): JSX.Element {
  const piggyBankElement = useRef<SVGSVGElement>(null);

  useEffect((): void => breathe(piggyBankElement.current), []);

  const collectAndDrop = (place: number, tappedCoin: HTMLElement): void => {
    onCollect(place);
    dropIntoSlot({
      coin: tappedCoin,
      piggyBank: piggyBankElement.current,
      onLand: (): void => {
        onLand(place);
        wiggleThenBreathe(piggyBankElement.current);
      },
    });
  };

  return (
    <>
      <InterestCoins
        interestCoins={interestCoins}
        onCollect={collectAndDrop}
        whereFocusGoesLast={whereFocusGoesLast}
      />
      <PiggyBankSpace>
        <PiggyBank piggyBankFill={piggyBankFill} ref={piggyBankElement} />
      </PiggyBankSpace>
    </>
  );
}
