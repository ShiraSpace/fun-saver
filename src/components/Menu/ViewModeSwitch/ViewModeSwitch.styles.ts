import styled from '@emotion/styled';
import { REDUCED_MOTION } from '@/theme/motion';
import { VIEW_MODE_SWITCH_MOTION } from './constants';

export const Row = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

export const Track = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 64px;
  height: 36px;
  margin-inline-start: auto;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.divider};
  transition: background ${VIEW_MODE_SWITCH_MOTION.slideMs}ms ease;

  &[data-on='true'] {
    background: ${({ theme }): string => theme.colors.primary};
  }

  @media ${REDUCED_MOTION} {
    transition: none;
  }
`;

export const Knob = styled.span`
  position: absolute;
  top: 3px;
  inset-inline-start: 3px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${({ theme }): string => theme.colors.surface};
  box-shadow: 0 1px 2px ${({ theme }): string => theme.shadows.mid};
  font-size: 19px;
  transition: inset-inline-start ${VIEW_MODE_SWITCH_MOTION.slideMs}ms ease;

  [data-on='true'] > & {
    inset-inline-start: 31px;
  }

  @media ${REDUCED_MOTION} {
    transition: none;
  }
`;
