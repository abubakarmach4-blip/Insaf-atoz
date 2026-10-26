/**
 * Intelligent Client-Side Canvas Background Removal Algorithm
 * Designed for automotive spare parts, oil bottles, and filters.
 * Analyzes border background samples, uses flood-fill edge detection
 * and soft feathering to isolate the product object into a clean transparent PNG.
 */

export interface RemovalOptions {
  tolerance: number; // 1 to 100
  featherRadius?: number; // 0 to 5
  autoCrop?: boolean;
  detectMode?: 'auto' | 'light' | 'dark' | 'green';
}

export function processImageBackgroundRemoval(
  sourceCanvas: HTMLCanvasElement,
  options: RemovalOptions
): { outputCanvas: HTMLCanvasElement; dataUrl: string } {
  const { tolerance = 35, featherRadius = 2, autoCrop = true, detectMode = 'auto' } = options;

  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  // Create working canvas
  const workCanvas = document.createElement('canvas');
  workCanvas.width = width;
  workCanvas.height = height;
  const ctx = workCanvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2d context');

  ctx.drawImage(sourceCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Sample background colors from the corners and borders (top, bottom, left, right edges)
  const samplePixels: [number, number, number][] = [];
  const sampleSize = Math.max(4, Math.floor(Math.min(width, height) * 0.05));

  // Sample 4 corners
  const sampleAreas = [
    { x: 0, y: 0 },
    { x: width - sampleSize, y: 0 },
    { x: 0, y: height - sampleSize },
    { x: width - sampleSize, y: height - sampleSize },
  ];

  sampleAreas.forEach((area) => {
    for (let dy = 0; dy < sampleSize; dy += 2) {
      for (let dx = 0; dx < sampleSize; dx += 2) {
        const px = area.x + dx;
        const py = area.y + dy;
        if (px >= 0 && px < width && py >= 0 && py < height) {
          const idx = (py * width + px) * 4;
          samplePixels.push([data[idx], data[idx + 1], data[idx + 2]]);
        }
      }
    }
  });

  // Calculate median / average background color
  let avgR = 0;
  let avgG = 0;
  let avgB = 0;
  samplePixels.forEach(([r, g, b]) => {
    avgR += r;
    avgG += g;
    avgB += b;
  });
  avgR = Math.round(avgR / (samplePixels.length || 1));
  avgG = Math.round(avgG / (samplePixels.length || 1));
  avgB = Math.round(avgB / (samplePixels.length || 1));

  // Determine target background reference depending on mode
  let refR = avgR;
  let refG = avgG;
  let refB = avgB;

  if (detectMode === 'light') {
    refR = 245;
    refG = 245;
    refB = 245;
  } else if (detectMode === 'dark') {
    refR = 25;
    refG = 25;
    refB = 25;
  } else if (detectMode === 'green') {
    refR = 30;
    refG = 210;
    refB = 30;
  }

  // Normalized distance threshold
  const maxDistance = 441.67; // Math.sqrt(255^2 + 255^2 + 255^2)
  const distanceThreshold = (tolerance / 100) * maxDistance;
  const softThreshold = distanceThreshold * 0.75;

  // 2. Flood Fill from Borders to prevent eating inner white/matching logos on products!
  // Mask array: 0 = product, 1 = background, 2 = visited
  const mask = new Uint8Array(width * height);
  const queue: number[] = [];

  // Helper to test if a pixel matches background
  const isBgPixel = (r: number, g: number, b: number) => {
    const dr = r - refR;
    const dg = g - refG;
    const db = b - refB;
    const dist = Math.sqrt(0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db);
    return dist < distanceThreshold;
  };

  // Seed borders into queue
  for (let x = 0; x < width; x++) {
    // top edge
    let idx = (0 * width + x) * 4;
    if (isBgPixel(data[idx], data[idx + 1], data[idx + 2])) {
      mask[0 * width + x] = 1;
      queue.push(0 * width + x);
    }
    // bottom edge
    idx = ((height - 1) * width + x) * 4;
    if (isBgPixel(data[idx], data[idx + 1], data[idx + 2])) {
      mask[(height - 1) * width + x] = 1;
      queue.push((height - 1) * width + x);
    }
  }

  for (let y = 0; y < height; y++) {
    // left edge
    let idx = (y * width + 0) * 4;
    if (isBgPixel(data[idx], data[idx + 1], data[idx + 2])) {
      mask[y * width + 0] = 1;
      queue.push(y * width + 0);
    }
    // right edge
    idx = (y * width + (width - 1)) * 4;
    if (isBgPixel(data[idx], data[idx + 1], data[idx + 2])) {
      mask[y * width + (width - 1)] = 1;
      queue.push(y * width + (width - 1));
    }
  }

  // BFS flood fill
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && mask[n] === 0) {
        const nIdx = n * 4;
        if (isBgPixel(data[nIdx], data[nIdx + 1], data[nIdx + 2])) {
          mask[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // 3. Apply alpha mask with feathering
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let hasForeground = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pIdx = y * width + x;
      const dIdx = pIdx * 4;

      if (mask[pIdx] === 1) {
        // Pure background
        data[dIdx + 3] = 0;
      } else {
        // Check proximity to background for anti-aliasing / feather
        let isEdge = false;
        if (featherRadius > 0) {
          for (let fy = -featherRadius; fy <= featherRadius; fy++) {
            for (let fx = -featherRadius; fx <= featherRadius; fx++) {
              const nx = x + fx;
              const ny = y + fy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                if (mask[ny * width + nx] === 1) {
                  isEdge = true;
                  break;
                }
              }
            }
            if (isEdge) break;
          }
        }

        if (isEdge) {
          const dr = data[dIdx] - refR;
          const dg = data[dIdx + 1] - refG;
          const db = data[dIdx + 2] - refB;
          const dist = Math.sqrt(0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db);
          const alphaRatio = Math.min(1, Math.max(0, (dist - softThreshold) / (distanceThreshold - softThreshold || 1)));
          data[dIdx + 3] = Math.round(alphaRatio * 255);
        }

        // Bounding box tracking for auto-crop
        if (data[dIdx + 3] > 30) {
          hasForeground = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // 4. Auto-crop if desired and foreground found
  if (autoCrop && hasForeground && maxX > minX && maxY > minY) {
    const pad = 12;
    const cropX = Math.max(0, minX - pad);
    const cropY = Math.max(0, minY - pad);
    const cropW = Math.min(width - cropX, maxX - minX + pad * 2);
    const cropH = Math.min(height - cropY, maxY - minY + pad * 2);

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropW;
    croppedCanvas.height = cropH;
    const croppedCtx = croppedCanvas.getContext('2d');
    if (croppedCtx) {
      croppedCtx.drawImage(workCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      return {
        outputCanvas: croppedCanvas,
        dataUrl: croppedCanvas.toDataURL('image/png'),
      };
    }
  }

  return {
    outputCanvas: workCanvas,
    dataUrl: workCanvas.toDataURL('image/png'),
  };
}
