/**
 * Clean SVG Barcode generator for macarte
 */

// Simple Code 128-like pattern generation for crisp SVG rendering
export function generateBarcodeSvg(value: string, showText: boolean = true, fgColor: string = '#000000', bgColor: string = 'transparent'): string {
  const safeText = value || 'CARD-0000';
  let hash = 0;
  for (let i = 0; i < safeText.length; i++) {
    hash = (hash << 5) - hash + safeText.charCodeAt(i);
    hash |= 0;
  }

  // Generate deterministic bar widths based on input string
  const bars: { x: number; width: number }[] = [];
  let currentX = 10;
  
  // Start guard
  bars.push({ x: currentX, width: 3 });
  currentX += 5;
  bars.push({ x: currentX, width: 2 });
  currentX += 4;
  bars.push({ x: currentX, width: 1 });
  currentX += 4;

  for (let i = 0; i < safeText.length; i++) {
    const code = safeText.charCodeAt(i);
    const pattern = [
      (code % 3) + 1,
      ((code >> 2) % 3) + 1,
      ((code >> 4) % 3) + 1,
      ((code >> 1) % 2) + 1,
    ];

    pattern.forEach((w, idx) => {
      if (idx % 2 === 0) {
        bars.push({ x: currentX, width: w * 1.5 });
      }
      currentX += (w * 1.5) + ((idx % 2 === 0) ? 2 : 1.5);
    });
  }

  // Stop guard
  bars.push({ x: currentX, width: 2 });
  currentX += 4;
  bars.push({ x: currentX, width: 3 });
  currentX += 5;
  bars.push({ x: currentX, width: 1 });
  currentX += 10;

  const totalWidth = currentX;
  const barHeight = showText ? 50 : 70;

  return `
    <svg viewBox="0 0 ${totalWidth} 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;">
      <rect width="${totalWidth}" height="80" fill="${bgColor}" />
      ${bars.map(b => `<rect x="${b.x}" y="5" width="${b.width}" height="${barHeight}" fill="${fgColor}" />`).join('')}
      ${showText ? `<text x="${totalWidth / 2}" y="72" fill="${fgColor}" font-family="monospace" font-size="11" font-weight="600" text-anchor="middle" letter-spacing="2">${escapeXml(safeText)}</text>` : ''}
    </svg>
  `;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
