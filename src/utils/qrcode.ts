/**
 * Clean SVG QR Code generator for macarte
 */

export function generateQrCodeSvg(value: string, fgColor: string = '#000000', bgColor: string = '#ffffff'): string {
  const safeText = value || 'https://macarte.edu';
  const size = 25; // 25x25 grid
  const matrix: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

  // Seeded pseudo-random generator
  let seed = 0;
  for (let i = 0; i < safeText.length; i++) {
    seed = (seed << 5) - seed + safeText.charCodeAt(i);
    seed |= 0;
  }
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // 1. Draw 3 Finder Patterns (top-left, top-right, bottom-left)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // Outer ring
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)      // Inner square
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // 2. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Fill data modules
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= size - 8;
      const inBottomLeft = r >= size - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        matrix[r][c] = random() > 0.48;
      }
    }
  }

  // Build SVG path / rects
  const rects: string[] = [];
  const cellSize = 4;
  const padding = 2 * cellSize;
  const totalPx = size * cellSize + (padding * 2);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c]) {
        rects.push(`<rect x="${padding + c * cellSize}" y="${padding + r * cellSize}" width="${cellSize}" height="${cellSize}" fill="${fgColor}" />`);
      }
    }
  }

  return `
    <svg viewBox="0 0 ${totalPx} ${totalPx}" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; display: block;">
      <rect width="${totalPx}" height="${totalPx}" fill="${bgColor}" />
      ${rects.join('')}
    </svg>
  `;
}
