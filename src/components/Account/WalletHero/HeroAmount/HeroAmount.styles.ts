import styled from '@emotion/styled';

export const Block = styled.div`
  text-align: center;
  margin-top: 8px;
`;

export const Label = styled.div`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${({ theme }): string => theme.colors.textMuted};
  margin-bottom: 3px;
`;

export const Big = styled.div`
  font-size: ${({ theme }): number => theme.typography.display}px;
`;
