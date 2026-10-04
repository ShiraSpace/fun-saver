import styled from '@emotion/styled';
import { REDUCED_MOTION } from '@/theme/motion';
import { VIEW_MODE_SWITCH_MOTION } from './ViewModeSwitch/constants';

export const Track = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.divider};
  transition: background ${VIEW_MODE_SWITCH_MOTION.slideMs}ms ease;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    inset-inline-start: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${({ theme }): string => theme.colors.surface};
    transition: inset-inline-start ${VIEW_MODE_SWITCH_MOTION.slideMs}ms ease;
  }

  @media ${REDUCED_MOTION} {
    transition: none;

    &::after {
      transition: none;
    }
  }

  &[data-on='true'] {
    background: ${({ theme }): string => theme.colors.primary};
  }

  &[data-on='true']::after {
    inset-inline-start: 23px;
  }
`;
