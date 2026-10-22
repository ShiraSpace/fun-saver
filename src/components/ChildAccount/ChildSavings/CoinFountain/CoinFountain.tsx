import { JSX } from 'react';
import { COIN_FOUNTAIN_COINS, COIN_FOUNTAIN_TEST_IDS } from './constants';
import { FlyingCoin, Fountain } from './CoinFountain.styles';

export function CoinFountain(): JSX.Element {
  const coins = COIN_FOUNTAIN_COINS.map((coin, index) => (
    <FlyingCoin key={index} coin={coin} data-testid={COIN_FOUNTAIN_TEST_IDS.coin} />
  ));

  return (
    <Fountain aria-hidden data-testid={COIN_FOUNTAIN_TEST_IDS.fountain}>
      {coins}
    </Fountain>
  );
}
