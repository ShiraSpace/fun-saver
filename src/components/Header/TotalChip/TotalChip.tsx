'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { Money } from '@/components/Money';
import {
  TOTAL_CHIP_COPY,
  TOTAL_CHIP_STYLE,
  TOTAL_CHIP_TEST_IDS,
} from './constants';

const Chip = styled.div`
  flex-shrink: 0;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  line-height: ${TOTAL_CHIP_STYLE.lineHeight};
  padding: ${TOTAL_CHIP_STYLE.paddingY}px ${TOTAL_CHIP_STYLE.paddingX}px;
  border-radius: ${TOTAL_CHIP_STYLE.radius}px;
  background: ${({ theme }): string => theme.colors.softBg};
  border: ${TOTAL_CHIP_STYLE.borderWidth}px solid
    ${({ theme }): string => theme.colors.softBorder};
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

const Label = styled.span`
  font-size: ${TOTAL_CHIP_STYLE.labelFontSize}px;
  font-weight: ${TOTAL_CHIP_STYLE.labelWeight};
  letter-spacing: ${TOTAL_CHIP_STYLE.labelLetterSpacing}px;
  color: ${({ theme }): string => theme.colors.softText};
`;

interface TotalChipProps {
  totalBalance: number;
}

export function TotalChip({ totalBalance }: TotalChipProps): JSX.Element {
  return (
    <Chip data-testid={TOTAL_CHIP_TEST_IDS.chip}>
      <Label>{TOTAL_CHIP_COPY.label}</Label>
      <Money amountAgorot={totalBalance} testId={TOTAL_CHIP_TEST_IDS.amount} />
    </Chip>
  );
}
