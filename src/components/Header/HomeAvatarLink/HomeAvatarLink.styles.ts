import styled from '@emotion/styled';
import Link from 'next/link';
import { HEADER_LAYOUT } from '../constants';

export const Ring = styled(Link)`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 50%;
  transition:
    opacity ${HEADER_LAYOUT.transitionMs}ms ease,
    visibility ${HEADER_LAYOUT.transitionMs}ms ease;

  &[data-hidden='true'] {
    opacity: 0;
    visibility: hidden;
  }
`;

export const HouseBadge = styled.span`
  position: absolute;
  inset-block-end: -4px;
  inset-inline-start: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ theme }): string => theme.colors.surface};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.28);
  font-size: 11px;
  line-height: 1;
`;
