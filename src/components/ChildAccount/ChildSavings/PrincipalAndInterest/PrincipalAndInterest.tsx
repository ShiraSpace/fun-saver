import { JSX } from 'react';
import { Money } from '@/components/Money';
import { PRINCIPAL_AND_INTEREST_COPY, PRINCIPAL_AND_INTEREST_TEST_IDS } from './constants';
import { Earned, Split, Tile, TileAmount } from './PrincipalAndInterest.styles';

interface PrincipalAndInterestProps {
  principal: number;
  interestEarned: number;
}

export function PrincipalAndInterest({
  principal,
  interestEarned,
}: PrincipalAndInterestProps): JSX.Element {
  return (
    <Split>
      <Tile>
        {PRINCIPAL_AND_INTEREST_COPY.principal}
        <TileAmount>
          <Money
            amountAgorot={principal}
            testId={PRINCIPAL_AND_INTEREST_TEST_IDS.principal}
            fullSizeCurrency
          />
        </TileAmount>
      </Tile>
      <Earned>
        {PRINCIPAL_AND_INTEREST_COPY.interestEarned}
        <TileAmount dir="ltr">
          {PRINCIPAL_AND_INTEREST_COPY.earnedSign}
          <Money
            amountAgorot={interestEarned}
            testId={PRINCIPAL_AND_INTEREST_TEST_IDS.interestEarned}
            fullSizeCurrency
          />
        </TileAmount>
      </Earned>
    </Split>
  );
}
