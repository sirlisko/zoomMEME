export const FRAME_RATIO = 0.5;
const ADJUST_STEP = 1.25;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function zoomLevels(maxZoom, count, adjustments = []) {
  return Array.from({ length: count }, (_, i) =>
    Math.max(
      1,
      maxZoom ** (i / (count - 1)) * ADJUST_STEP ** (adjustments[i] ?? 0),
    ),
  );
}

// Crops are in source pixels, ready for drawImage. Frame 1 is the largest
// 2:1 crop the photo allows; each later frame narrows in on the focus point.
export default function computeFrames({
  width,
  height,
  focusX,
  focusY,
  zoom,
  count,
  adjustments,
}) {
  const aspect = height / width;
  const base = Math.min(1, aspect / FRAME_RATIO);

  return zoomLevels(zoom, count, adjustments).map((level) => {
    const w = base / level;
    const h = w * FRAME_RATIO;
    const x = clamp(focusX - w / 2, 0, 1 - w);
    const y = clamp(focusY * aspect - h / 2, 0, aspect - h);
    return {
      zoom: level,
      sx: x * width,
      sy: y * width,
      sw: w * width,
      sh: h * width,
    };
  });
}
