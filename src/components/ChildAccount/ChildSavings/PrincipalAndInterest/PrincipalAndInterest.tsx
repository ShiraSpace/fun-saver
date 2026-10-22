import { JSX } from 'react';
import { Money } from '@/components/Money';
import { useCountUp } from '@/hooks/use-count-up';
import { SAVINGS_ROLL_UP } from '../constants';
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
  const interestEarnedOnScreen = useCountUp({
    startAt: interestEarned,
    to: interestEarned,
    timing: SAVINGS_ROLL_UP,
  });

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
            amountAgorot={interestEarnedOnScreen}
            testId={PRINCIPAL_AND_INTEREST_TEST_IDS.interestEarned}
            fullSizeCurrency
          />
        </Amount>
      </InterestEarned>
    </Breakdown>
  );
}
