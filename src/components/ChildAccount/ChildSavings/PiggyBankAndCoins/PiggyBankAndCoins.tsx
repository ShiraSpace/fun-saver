'use client';

import { JSX, RefObject } from 'react';
import { InterestCoins, type InterestCoin } from '../InterestCoins';
import { PiggyBank } from '../PiggyBank';
import { CoinFountain } from '../CoinFountain';
import { useCoinsIntoThePiggyBank } from './use-coins-into-the-piggy-bank';
import { PiggyBankSpace } from './PiggyBankAndCoins.styles';

interface PiggyBankAndCoinsProps {
  interestCoins: InterestCoin[];
  piggyBankFill: number;
  isGoalReached: boolean;
  onCollect: (place: number) => void;
  onLand: (place: number) => void;
  whereFocusGoesLast: RefObject<HTMLElement | null>;
}

export function PiggyBankAndCoins({
  interestCoins,
  piggyBankFill,
  isGoalReached,
  onCollect,
  onLand,
  whereFocusGoesLast,
}: PiggyBankAndCoinsProps): JSX.Element {
  const { piggyBankElement, whereThePiggyBankStands, collectAndDrop } = useCoinsIntoThePiggyBank({
    onCollect,
    onLand,
  });
  const coinFountain = isGoalReached && <CoinFountain />;

  return (
    <>
      <InterestCoins
        interestCoins={interestCoins}
        onCollect={collectAndDrop}
        whereFocusGoesLast={whereFocusGoesLast}
      />
      <PiggyBankSpace ref={whereThePiggyBankStands}>
        <PiggyBank
          piggyBankFill={piggyBankFill}
          isGoalReached={isGoalReached}
          ref={piggyBankElement}
        />
        {coinFountain}
      </PiggyBankSpace>
    </>
  );
}
