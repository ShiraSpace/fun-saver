import styled from '@emotion/styled';
import Link from 'next/link';
import {
  MENU_OVERLAY_LAYOUT,
  MENU_OVERLAY_STYLE,
} from '../MenuOverlay/constants';
import { childMenuRow } from '../row-parts';

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(
    100dvh - ${MENU_OVERLAY_LAYOUT.top}px -
      ${MENU_OVERLAY_LAYOUT.contentPaddingTop}px -
      ${MENU_OVERLAY_STYLE.paddingBottom}px
  );
`;

export const Child = styled.div`
  display: flex;
  align-items: center;
  ${childMenuRow}
  margin-bottom: 12px;
  border-radius: 22px;
  background: ${({ theme }): string => theme.colors.surface};
`;

export const ChildName = styled.b`
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 76px;
  padding: 16px 18px;
  margin-bottom: 12px;
  border-radius: 22px;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  text-decoration: none;
  color: ${({ theme }): string => theme.colors.surface};
  background: ${({ theme }): string => theme.colors.textStrong};
`;

export const ParentCorner = styled.div`
  display: flex;
  justify-content: center;
  margin-top: auto;
  padding-top: 28px;
`;
