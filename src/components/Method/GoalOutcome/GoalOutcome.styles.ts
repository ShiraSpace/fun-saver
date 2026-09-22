import styled from '@emotion/styled';

export const Outcome = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const Icon = styled.span`
  flex: none;
  font-size: 20px;
  line-height: 1.35;
`;

export const Text = styled.span`
  font-size: 14px;
  line-height: 1.7;
`;

export const Note = styled.span`
  display: block;
  margin-top: 3px;
  font-size: 12.5px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;
