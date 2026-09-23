import styled from '@emotion/styled';
import Image from 'next/image';
import type { Theme } from '@emotion/react';
import { MENU_ROW_STYLE } from '../constants';
import { PROFILE_SECTION_PHOTO_SIZE } from './constants';

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const strongText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

const scopeBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBorder;

const softFill = ({ theme }: { theme: Theme }): string => theme.colors.softBg;

const softEdge = ({ theme }: { theme: Theme }): string =>
  theme.colors.softBorder;

const surface = ({ theme }: { theme: Theme }): string => theme.colors.surface;

const nameSize = ({ theme }: { theme: Theme }): number => theme.typography.body;

const subSize = ({ theme }: { theme: Theme }): number => theme.typography.label;

export const Block = styled.div`
  padding-bottom: 9px;
  margin-bottom: 9px;
  border-bottom: 1px solid ${scopeBorder};
`;

export const Strip = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

export const UserMark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${PROFILE_SECTION_PHOTO_SIZE}px;
  height: ${PROFILE_SECTION_PHOTO_SIZE}px;
  border: ${MENU_ROW_STYLE.borderWidth}px solid ${softEdge};
  border-radius: 50%;
  background: ${softFill};
  font-size: 19px;
`;

export const UserPhoto = styled(Image)`
  flex-shrink: 0;
  border: ${MENU_ROW_STYLE.borderWidth}px solid ${softEdge};
  border-radius: 50%;
  object-fit: cover;
`;

export const Naming = styled.span`
  flex: 1;
  min-width: 0;
  text-align: start;
`;

export const Name = styled.b`
  display: block;
  font-size: ${nameSize}px;
  font-weight: 700;
  color: ${strongText};
`;

export const Email = styled.span`
  display: inline-block;
  max-width: 100%;
  margin-top: 1px;
  font-size: ${subSize}px;
  color: ${mutedText};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SignOut = styled.button`
  flex-shrink: 0;
  padding: 5px 10px;
  border: ${MENU_ROW_STYLE.borderWidth}px solid ${scopeBorder};
  border-radius: 12px;
  background: ${surface};
  color: ${mutedText};
  font: inherit;
  font-size: ${subSize}px;
  font-weight: 600;
  cursor: pointer;
  transition: transform ${MENU_ROW_STYLE.pressMs}ms ease;

  &:active {
    transform: scale(${MENU_ROW_STYLE.pressScale});
  }

  &:disabled {
    cursor: default;
    opacity: 0.55;
    transform: none;
  }
`;

export const SignOutError = styled.p`
  margin: 7px 0 0;
  font-size: ${subSize}px;
  color: ${({ theme }: { theme: Theme }): string => theme.colors.alert};
  text-align: start;
`;
