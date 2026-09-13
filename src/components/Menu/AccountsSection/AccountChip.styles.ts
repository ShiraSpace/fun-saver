import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ACCOUNTS_SECTION_STYLE } from '@/components/Menu/AccountsSection/constants';

const ringColor = ({ theme }: { theme: Theme }): string => theme.colors.star;

export const Chip = styled.button`
  position: relative;
  line-height: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform ${ACCOUNTS_SECTION_STYLE.pressMs}ms ease;

  img {
    transition: box-shadow ${ACCOUNTS_SECTION_STYLE.ringMs}ms ease;
  }

  &:active {
    transform: scale(${ACCOUNTS_SECTION_STYLE.pressScale});
  }

  &[data-selected='true'] img {
    box-shadow: 0 0 0 ${ACCOUNTS_SECTION_STYLE.ringWidth}px ${ringColor};
  }
`;

const badgeFontSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.label;

const badgeBg = ({ theme }: { theme: Theme }): string => theme.colors.primary;

const badgeColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

export const Badge = styled.span`
  position: absolute;
  bottom: -2px;
  inset-inline-start: -2px;
  min-width: ${ACCOUNTS_SECTION_STYLE.badgeSize}px;
  height: ${ACCOUNTS_SECTION_STYLE.badgeSize}px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: 999px;
  background: ${badgeBg};
  color: ${badgeColor};
  font-size: ${badgeFontSize}px;
  font-weight: 700;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
