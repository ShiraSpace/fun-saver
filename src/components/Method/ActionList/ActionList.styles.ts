import styled from '@emotion/styled';

export const Group = styled.div`
  margin-top: 12px;
  padding: 11px 12px 6px;
  border-radius: 12px;
  background: ${({ theme }): string => theme.colors.depositBg};
`;

export const Label = styled.div`
  margin-bottom: 2px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: ${({ theme }): string => theme.colors.softText};
`;

export const Items = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Item = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }): string => theme.colors.divider};

  &:last-child {
    border-bottom: none;
  }
`;

export const Box = styled.span`
  position: relative;
  flex: none;
  width: 19px;
  height: 19px;
  margin-top: 2px;
  border: 2px solid ${({ theme }): string => theme.colors.softBorder};
  border-radius: 6px;

  &[data-done='true'] {
    background: ${({ theme }): string => theme.colors.softBorder};
  }

  &[data-done='true']::after {
    content: '✓';
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${({ theme }): number => theme.typography.label}px;
    font-weight: 700;
    color: ${({ theme }): string => theme.colors.softText};
  }
`;

export const Question = styled.span`
  display: block;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 600;
  line-height: 1.5;
`;

export const Answer = styled.span`
  display: block;
  margin-top: 2px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  line-height: 1.6;
  color: ${({ theme }): string => theme.colors.textMuted};

  strong {
    color: ${({ theme }): string => theme.colors.textStrong};
  }
`;
