export function hexToRgb(hex: string): string {
  const value = parseInt(hex.slice(1), 16);
  return `rgb(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255})`;
}

export function gradientToRgb(gradient: string): string {
  return gradient.replace(/#[0-9a-fA-F]{6}/g, hexToRgb);
}
