export type PictureWords = Record<string, string[]>;

export type UnicodeEmoji = Record<string, { emoji_version: string }>;

export interface UnicodeWords {
  default?: string[];
  tts?: string[];
}
