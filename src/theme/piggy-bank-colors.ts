export interface GradientStop {
  offset: number;
  color: string;
  opacity?: number;
}

export const PIGGY_BANK_COLORS = {
  shadow: '#000000',
  feet: '#E7799F',
  shine: '#FFFFFF',
  earShine: '#FFE4EE',
  bellyRim: '#FFFFFF',
  belly: '#FFF3E6',
  eye: '#3A1F5A',
  cheek: '#E5568B',
  nostril: '#A93C66',
  slot: '#7A2F55',
  coinEdge: '#B9810C',
  coinRim: '#E0A21F',
} as const;

export const PIGGY_BANK_GRADIENT_STOPS = {
  coinFace: [
    { offset: 0, color: '#FFF4C4' },
    { offset: 0.55, color: '#FFC93C' },
    { offset: 1, color: '#E9A400' },
  ],
  body: [
    { offset: 0, color: '#FFE4EE' },
    { offset: 0.5, color: '#FCAEC9' },
    { offset: 1, color: '#E7799F' },
  ],
  ear: [
    { offset: 0, color: '#F7A3C2' },
    { offset: 1, color: '#E06C97' },
  ],
  snout: [
    { offset: 0, color: '#FFC9DB' },
    { offset: 1, color: '#EA7FA5' },
  ],
  glass: [
    { offset: 0, color: '#FFFFFF', opacity: 0.6 },
    { offset: 0.5, color: '#FFFFFF', opacity: 0 },
  ],
} as const satisfies Record<string, readonly GradientStop[]>;
