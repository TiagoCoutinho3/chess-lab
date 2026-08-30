/**
 * Color utility functions for dynamic color adjustments
 */

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Calculate perceived brightness of a color
 * Returns value between 0 (black) and 255 (white)
 */
export function getBrightness(hex: string): number {
  const rgb = hexToRgb(hex);
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

/**
 * Determine if a color is dark or light
 * Uses threshold of 128
 */
export function isDarkColor(hex: string): boolean {
  return getBrightness(hex) < 128;
}

/**
 * Adjust color brightness
 * @param hex - Input hex color
 * @param amount - Amount to adjust (-100 to 100)
 * @returns Adjusted hex color
 */
export function adjustBrightness(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  
  const adjust = (value: number) => {
    const adjusted = value + amount;
    return Math.max(0, Math.min(255, adjusted));
  };
  
  const r = adjust(rgb.r);
  const g = adjust(rgb.g);
  const b = adjust(rgb.b);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Adjust color saturation
 * @param hex - Input hex color
 * @param amount - Amount to adjust saturation (-100 to 100)
 * @returns Adjusted hex color
 */
export function adjustSaturation(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  
  // Convert to HSL
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // Adjust saturation
  s = Math.max(0, Math.min(1, s + amount / 100));
  
  // Convert back to RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  const r2 = hue2rgb(p, q, h + 1/3);
  const g2 = hue2rgb(p, q, h);
  const b2 = hue2rgb(p, q, h - 1/3);
  
  return `#${Math.round(r2 * 255).toString(16).padStart(2, '0')}${Math.round(g2 * 255).toString(16).padStart(2, '0')}${Math.round(b2 * 255).toString(16).padStart(2, '0')}`;
}

/**
 * Adjust color hue
 * @param hex - Input hex color
 * @param degrees - Amount to rotate hue in degrees (-180 to 180)
 * @returns Adjusted hex color
 */
export function adjustHue(hex: string, degrees: number): string {
  const rgb = hexToRgb(hex);
  
  // Convert to HSL
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // Adjust hue
  h = (h + degrees / 360) % 1;
  if (h < 0) h += 1;
  
  // Convert back to RGB
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  const r2 = hue2rgb(p, q, h + 1/3);
  const g2 = hue2rgb(p, q, h);
  const b2 = hue2rgb(p, q, h - 1/3);
  
  return `#${Math.round(r2 * 255).toString(16).padStart(2, '0')}${Math.round(g2 * 255).toString(16).padStart(2, '0')}${Math.round(b2 * 255).toString(16).padStart(2, '0')}`;
}

/**
 * Generate highlight color for last move squares
 * Uses the dark square color as base for both light and dark squares
 * Light squares become lighter version of dark color
 * Dark squares become darker version of dark color
 * @param darkSquareColor - The dark square color of the board
 * @param isLightSquare - Whether this is a light square on the board
 * @returns Hex color with opacity as rgba string
 */
export function getHighlightColor(darkSquareColor: string, isLightSquare: boolean): string {
  // Increase saturation for both to make colors more vibrant
  const saturationAdjustment = 40;
  
  // Small hue adjustment for color variation (same for both squares)
  const hueAdjustment = 11;
  
  // Light squares: no brightness adjustment (use base color)
  // Dark squares: make darker (decrease brightness from dark color)
  const brightnessAdjustment = isLightSquare ? 23 : -57;
  
  // Apply saturation first, then hue, then brightness adjustment
  let adjustedColor = adjustSaturation(darkSquareColor, saturationAdjustment);
  adjustedColor = adjustHue(adjustedColor, hueAdjustment);
  adjustedColor = adjustBrightness(adjustedColor, brightnessAdjustment);
  
  const rgb = hexToRgb(adjustedColor);
  
  // Return as rgba with opacity (same for both squares)
  const opacity = 0.8;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}
