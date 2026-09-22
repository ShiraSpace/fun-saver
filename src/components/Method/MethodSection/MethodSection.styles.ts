import styled from '@emotion/styled';
import { REDUCED_MOTION } from '@/theme/motion';

export const Section = styled.details`
  overflow: hidden;
  border-radius: 14px;
  background: ${({ theme }): string => theme.colors.surface};
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.06);
  color: ${({ theme }): string => theme.colors.textStrong};
  text-align: start;
`;

export const Summary = styled.summary`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  list-style: none;
  cursor: pointer;

  &::-webkit-details-marker {
    display: none;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }): string => theme.colors.softBorder};
    outline-offset: -2px;
  }
`;

export const Numeral = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.gradients.actionButton};
  color: ${({ theme }): string => theme.colors.textOnPrimary};
  font-size: 13px;
  font-weight: 600;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

export const Hint = styled.span`
  font-size: 11.5px;
  font-weight: 500;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Chevron = styled.span`
  margin-inline-start: auto;
  font-size: 13px;
  color: ${({ theme }): string => theme.colors.textMuted};
  transition: transform 180ms ease;

  details[open] & {
    transform: rotate(180deg);
  }

  @media ${REDUCED_MOTION} {
    transition: none;
  }
`;

export const Body = styled.div`
  padding: 0 16px 16px;

  > p {
    margin: 0 0 10px;
    font-size: ${({ theme }): number => theme.typography.body}px;
    line-height: 1.75;
  }

  > p:last-child {
    margin-bottom: 0;
  }

  > p[data-muted='true'] {
    font-size: 13.5px;
    color: ${({ theme }): string => theme.colors.textMuted};
  }
`;
