import styled from '@emotion/styled';
import { css, type SerializedStyles, type Theme } from '@emotion/react';
import Link from 'next/link';
import { MENU_ROW_STYLE } from '../constants';

const tabFace = ({ theme }: { theme: Theme }): SerializedStyles => css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  min-width: 0;
  padding: 9px 4px;
  border: ${MENU_ROW_STYLE.borderWidth}px solid ${theme.colors.divider};
  border-radius: 15px;
  background: ${theme.colors.surface};
  font-family: inherit;
  font-size: ${theme.typography.label}px;
  font-weight: 600;
  color: ${theme.colors.textMuted};
  text-decoration: none;

  &[aria-current='page'] {
    border-color: ${theme.colors.textStrong};
    background: ${theme.colors.textStrong};
    color: ${theme.colors.surface};
  }
`;

export const Strip = styled.nav<{ columnCount: number }>`
  display: grid;
  grid-template-columns: repeat(
    ${({ columnCount }): number => columnCount},
    1fr
  );
  gap: 6px;
  margin-bottom: 14px;
`;

export const Tab = styled(Link)`
  ${tabFace}
`;

export const CurrentTab = styled.span`
  ${tabFace}
`;

export const InertTab = styled.button`
  ${tabFace}
  border-style: dashed;
  cursor: default;
`;

export const TabIcon = styled.span`
  font-size: ${({ theme }): number => theme.typography.heading}px;

  ${InertTab} & {
    opacity: 0.45;
  }
`;
