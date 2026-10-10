export const FRAME_RATIO = 0.5;
const ADJUST_STEP = 1.25;
export const MAX_ADJUST = 6;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatZoom(zoom) {
  return `${Math.round(zoom * 10) / 10}×`;
}

function baseWidth(width, height) {
  return Math.min(1, height / width / FRAME_RATIO);
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
// An offset ([dx, dy], as photo fractions) moves one frame off that point.
export default function computeFrames({
  width,
  height,
  focusX,
  focusY,
  zoom,
  count,
  adjustments,
  offsets = [],
}) {
  const aspect = height / width;
  const base = baseWidth(width, height);

  return zoomLevels(zoom, count, adjustments).map((level, i) => {
    const [dx, dy] = offsets[i] ?? [0, 0];
    const w = base / level;
    const h = w * FRAME_RATIO;
    const x = clamp(focusX + dx - w / 2, 0, 1 - w);
    const y = clamp((focusY + dy) * aspect - h / 2, 0, aspect - h);
    return {
      zoom: level,
      sx: x * width,
      sy: y * width,
      sw: w * width,
      sh: h * width,
    };
  });
}

// Inverse of zoomLevels for one frame: the adjustment that makes its crop
// span `fraction` of the photo's width.
export function adjustmentForWidth({
  width,
  height,
  zoom,
  count,
  index,
  fraction,
}) {
  const level = Math.max(1, baseWidth(width, height) / fraction);
  const planned = zoom ** (index / (count - 1));
  return clamp(
    Math.log(level / planned) / Math.log(ADJUST_STEP),
    -MAX_ADJUST,
    MAX_ADJUST,
  );
}
