import { JSX } from 'react';
import { Money } from '@/components/Money';
import { PRINCIPAL_AND_INTEREST_COPY, PRINCIPAL_AND_INTEREST_TEST_IDS } from './constants';
import { Amount, Breakdown, InterestEarned, Principal } from './PrincipalAndInterest.styles';

interface PrincipalAndInterestProps {
  principal: number;
  interestEarned: number;
}

export function PrincipalAndInterest({
  principal,
  interestEarned,
}: PrincipalAndInterestProps): JSX.Element {
  return (
    <Breakdown>
      <Principal>
        {PRINCIPAL_AND_INTEREST_COPY.principal}
        <Amount>
          <Money
            amountAgorot={principal}
            testId={PRINCIPAL_AND_INTEREST_TEST_IDS.principal}
            fullSizeCurrency
          />
        </Amount>
      </Principal>
      <InterestEarned>
        {PRINCIPAL_AND_INTEREST_COPY.interestEarned}
        <Amount dir="ltr" data-testid={PRINCIPAL_AND_INTEREST_TEST_IDS.gain}>
          {PRINCIPAL_AND_INTEREST_COPY.earnedSign}
          <Money
            amountAgorot={interestEarned}
            testId={PRINCIPAL_AND_INTEREST_TEST_IDS.interestEarned}
            fullSizeCurrency
          />
        </Amount>
      </InterestEarned>
    </Breakdown>
  );
}
