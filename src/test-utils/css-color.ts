export function hexToRgb(hex: string): string {
  const value = parseInt(hex.slice(1), 16);
  return `rgb(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255})`;
}

export function gradientToRgb(gradient: string): string {
  return gradient.replace(/#[0-9a-fA-F]{6}/g, hexToRgb);
}

export function opacityOf(element: Element): number {
  return Number(getComputedStyle(element).opacity || 1);
}

function channel(value: number): number {
  const ratio = value / 255;
  return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const value = parseInt(hex.slice(1), 16);
  const [red, green, blue] = [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255,
  ].map(channel);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(first: string, second: string): number {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a
  );
  return (lighter + 0.05) / (darker + 0.05);
}
