import styled from '@emotion/styled';
import { Screen } from '@/components/Screen';

export const Dialog = styled(Screen)`
  outline: none;
`;

export const Page = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 420px;
  padding: 22px 14px;
`;

export const ReachedHeading = styled.p`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textOnPrimary};
`;
