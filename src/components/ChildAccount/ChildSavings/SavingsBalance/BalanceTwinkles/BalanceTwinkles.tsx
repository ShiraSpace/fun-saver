import { JSX } from 'react';
import { BALANCE_TWINKLES_TEST_IDS, TWINKLE, TWINKLE_PLACES } from './constants';
import { Twinkle, Twinkles } from './BalanceTwinkles.styles';

export function BalanceTwinkles(): JSX.Element {
  const twinkles = TWINKLE_PLACES.map((place, index) => (
    <Twinkle key={index} place={place} turn={index} data-testid={BALANCE_TWINKLES_TEST_IDS.twinkle}>
      {TWINKLE}
    </Twinkle>
  ));

  return (
    <Twinkles aria-hidden data-testid={BALANCE_TWINKLES_TEST_IDS.twinkles}>
      {twinkles}
    </Twinkles>
  );
}
