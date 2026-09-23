import styled from '@emotion/styled';
import { ActionButton } from '@/components/ActionButton';
import { TYPE_SCALE } from '@/theme/typography';
import type { Themed } from '@/theme/themed';
import { GOOGLE_BRAND_WHITE, SIGN_IN_LAYOUT } from './constants';

const onPrimary = ({ theme }: Themed): string => theme.colors.textOnPrimary;
const surface = ({ theme }: Themed): string => theme.colors.surface;
const strong = ({ theme }: Themed): string => theme.colors.textStrong;
const muted = ({ theme }: Themed): string => theme.colors.textMuted;
const alertText = ({ theme }: Themed): string => theme.colors.alertText;
const midShadow = ({ theme }: Themed): string => theme.shadows.mid;

export const Wordmark = styled.h1`
  font-size: ${SIGN_IN_LAYOUT.wordmarkSize}px;
  font-weight: 700;
  margin: 0;
  color: ${onPrimary};
  text-shadow: 0 3px 0 ${midShadow};
`;

export const Tagline = styled.p`
  font-size: ${TYPE_SCALE.body}px;
  margin: 0;
  color: ${onPrimary};
  max-width: ${SIGN_IN_LAYOUT.taglineMaxWidth}ch;
  line-height: 1.5;
`;

export const Card = styled.section`
  width: 100%;
  max-width: ${SIGN_IN_LAYOUT.cardMaxWidth}px;
  background: ${surface};
  border-radius: ${SIGN_IN_LAYOUT.cardRadius}px;
  padding: ${SIGN_IN_LAYOUT.cardPaddingY}px ${SIGN_IN_LAYOUT.cardPaddingX}px;
  box-shadow: 0 12px 30px ${midShadow};
  display: flex;
  flex-direction: column;
  gap: ${SIGN_IN_LAYOUT.cardGap}px;
`;

export const CardTitle = styled.h2`
  font-size: ${TYPE_SCALE.title}px;
  font-weight: 700;
  margin: 0;
  color: ${strong};
`;

export const CardBody = styled.p`
  font-size: ${TYPE_SCALE.body}px;
  margin: 0;
  color: ${muted};
  line-height: 1.6;
`;

export const GoogleButton = styled(ActionButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${SIGN_IN_LAYOUT.googleButtonGap}px;
  width: 100%;
  font-size: ${TYPE_SCALE.body}px;

  &:disabled {
    cursor: progress;
    opacity: 0.75;
  }
`;

export const GoogleMark = styled.span`
  background: ${GOOGLE_BRAND_WHITE};
  border-radius: 50%;
  width: ${SIGN_IN_LAYOUT.googleMarkSize}px;
  height: ${SIGN_IN_LAYOUT.googleMarkSize}px;
  display: grid;
  place-items: center;
  flex: none;

  svg {
    width: ${SIGN_IN_LAYOUT.googleLogoSize}px;
    height: ${SIGN_IN_LAYOUT.googleLogoSize}px;
    display: block;
  }
`;

export const ErrorMessage = styled.p`
  font-size: ${TYPE_SCALE.label}px;
  margin: 0;
  color: ${alertText};
  line-height: 1.6;
`;

export const Fineprint = styled.p`
  font-size: ${TYPE_SCALE.label}px;
  margin: 0;
  color: ${onPrimary};
  line-height: 1.6;
  max-width: ${SIGN_IN_LAYOUT.fineprintMaxWidth}ch;
`;
