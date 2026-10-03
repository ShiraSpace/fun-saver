import styled from '@emotion/styled';
import Link from 'next/link';

export const Child = styled.div`
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 22px 16px;
  margin-bottom: 16px;
  border-radius: 22px;
  background: ${({ theme }): string => theme.colors.surface};
`;

export const ChildName = styled.b`
  font-size: ${({ theme }): number => theme.typography.title}px;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const HomeLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 76px;
  padding: 16px 18px;
  margin-bottom: 12px;
  border-radius: 22px;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  text-decoration: none;
  color: ${({ theme }): string => theme.colors.surface};
  background: ${({ theme }): string => theme.colors.textStrong};
`;

export const Item = styled.div`
  min-height: 76px;
  padding: 16px 18px;
  margin-bottom: 12px;
  border-radius: 22px;
  background: ${({ theme }): string => theme.colors.surface};
`;

export const ParentCorner = styled.div`
  margin-top: 28px;
`;
