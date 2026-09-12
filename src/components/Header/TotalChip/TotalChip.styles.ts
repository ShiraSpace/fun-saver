import styled from '@emotion/styled';
import { TOTAL_CHIP_STYLE } from './constants';

export const Chip = styled.div`
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

export const Label = styled.span`
  font-size: ${TOTAL_CHIP_STYLE.labelFontSize}px;
  font-weight: ${TOTAL_CHIP_STYLE.labelWeight};
  letter-spacing: ${TOTAL_CHIP_STYLE.labelLetterSpacing}px;
  color: ${({ theme }): string => theme.colors.softText};
`;
