import styled from '@emotion/styled';

export const Scroller = styled.div`
  margin: 14px 0 10px;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: 7px 6px;
    border-bottom: 1px solid ${({ theme }): string => theme.colors.divider};
    text-align: start;
    white-space: nowrap;
  }

  th {
    font-size: ${({ theme }): number => theme.typography.label}px;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: ${({ theme }): string => theme.colors.textMuted};
  }

  td + td {
    font-weight: 600;
  }
`;

export const Caption = styled.caption`
  margin-bottom: 4px;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 600;
  text-align: start;
`;
