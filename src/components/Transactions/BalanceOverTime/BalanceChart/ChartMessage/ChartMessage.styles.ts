import styled from '@emotion/styled';
import { readableOverLines } from '../chart-parts';

export const MessageText = styled.text`
  ${readableOverLines}
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  stroke-width: 3px;
  fill: ${({ theme }): string => theme.colors.textMuted};
`;
