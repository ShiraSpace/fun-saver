import styled from '@emotion/styled';
import { MONEY_STYLE } from './constants';

export const Amount = styled.span`
  display: inline-flex;
  align-items: flex-end;
  line-height: 1;
  font-weight: 700;
`;

export const Currency = styled.span`
  font-size: ${MONEY_STYLE.currencyScale}em;
  opacity: ${MONEY_STYLE.currencyOpacity};
  margin-inline-end: ${MONEY_STYLE.currencyGap}px;

  &[data-full-size='true'] {
    font-size: 1em;
    opacity: 1;
    margin-inline-end: 0;
  }
`;

export const Number = styled.span`
  font-variant-numeric: tabular-nums;
`;
