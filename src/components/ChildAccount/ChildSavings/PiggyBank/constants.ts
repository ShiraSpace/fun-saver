export const PIGGY_BANK_TEST_IDS = {
  art: 'piggy-bank',
} as const;

export const PIGGY_BANK_FILL = {
  empty: 0,
  full: 1,
} as const;

export const PIGGY_BANK_VIEW_BOX = '0 0 300 250';

export const BELLY = { cx: 150, cy: 180, rx: 58, ry: 38 } as const;

export const PIGGY_BANK_SHAPE = {
  shadow: { cx: 150, cy: 236, rx: 92, ry: 8, opacity: 0.22 },
  feet: [
    { cx: 114, cy: 226, rx: 22, ry: 12 },
    { cx: 186, cy: 226, rx: 22, ry: 12 },
  ],
  body: { cx: 150, cy: 138, rx: 108, ry: 92 },
  bodyShine: { cx: 112, cy: 76, rx: 40, ry: 16, opacity: 0.55 },
  earsLift: 'translate(0 -6)',
  ear: 'M74 60 C86 40 116 40 126 58 C116 66 104 82 94 98 C86 108 72 104 70 90 C68 78 68 68 74 60 Z',
  earShine: {
    d: 'M80 64 C90 52 108 50 116 58',
    fill: 'none',
    strokeWidth: 4,
    strokeLinecap: 'round',
    opacity: 0.8,
  },
  earMirror: 'matrix(-1 0 0 1 300 0)',
  bellyRim: { cx: 150, cy: 180, rx: 66, ry: 46 },
  glassStreak: {
    d: 'M104 168 Q116 150 140 146',
    fill: 'none',
    strokeWidth: 5,
    strokeLinecap: 'round',
    opacity: 0.9,
  },
  eyes: [
    {
      eye: { cx: 108, cy: 106, rx: 11, ry: 13 },
      glint: { cx: 112, cy: 101, r: 4.5 },
      sparkle: { cx: 104, cy: 111, r: 2 },
    },
    {
      eye: { cx: 192, cy: 106, rx: 11, ry: 13 },
      glint: { cx: 196, cy: 101, r: 4.5 },
      sparkle: { cx: 188, cy: 111, r: 2 },
    },
  ],
  cheeks: [
    { cx: 84, cy: 130, rx: 14, ry: 8, opacity: 0.4 },
    { cx: 216, cy: 130, rx: 14, ry: 8, opacity: 0.4 },
  ],
  snout: { cx: 150, cy: 120, rx: 27, ry: 17 },
  nostrils: [
    { cx: 141, cy: 120, rx: 4, ry: 6 },
    { cx: 159, cy: 120, rx: 4, ry: 6 },
  ],
  slot: { x: 128, y: 52, width: 44, height: 4, rx: 2 },
  slotShine: { x: 130, y: 57, width: 40, height: 1.6, rx: 0.8, opacity: 0.7 },
} as const;

export const PIGGY_BANK_GRADIENT_SHAPE = {
  coinFace: { cx: '35%', cy: '30%', r: '80%' },
  body: { cx: '40%', cy: '30%', r: '80%' },
  snout: { cx: '45%', cy: '30%', r: '80%' },
  vertical: { x1: 0, y1: 0, x2: 0, y2: 1 },
} as const;

export const PIGGY_BANK_BLUR = {
  shadow: 5,
  shine: 6,
} as const;

export const COIN_RADIUS = 10;
export const COIN_SQUASH = 0.42;

export const COIN_PILE_LAYOUT = {
  floorGap: 2,
  rowStep: COIN_RADIUS * 0.62,
  coinStep: COIN_RADIUS * 1.55,
  wallGap: COIN_RADIUS * 0.85,
  jitterX: 4,
  jitterY: 3,
  jitterTilt: 16,
  jitterSeed: { multiplier: 9301, offset: 49297, spread: 233280 },
  jitterChannel: { y: 99, tilt: 7 },
  jitterCentre: 0.5,
  rowsPerPattern: 2,
  oddRow: 1,
  spotPrecision: 100,
} as const;

export const PIGGY_BANK_WIGGLE = {
  durationMs: 450,
  tiltDegrees: 4,
  tiltLeftAt: 0.25,
  tiltRightAt: 0.75,
  upright: '0deg',
} as const;
