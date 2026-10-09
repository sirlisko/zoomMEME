import { applyPalette, GIFEncoder, quantize } from "gifenc";
import { drawFrame, OUTPUT_WIDTH } from "./draw";
import { FRAME_RATIO } from "./frames";

export const SPEEDS = { slow: 900, normal: 600, fast: 350 };

// The closest zoom stays on screen a beat longer so the punchline lands.
export function frameDelay(index, count, delay) {
  return index === count - 1 ? delay * 2 : delay;
}

export function encodeGif(image, frames, options, delay) {
  const width = OUTPUT_WIDTH;
  const height = width * FRAME_RATIO;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const gif = GIFEncoder();

  frames.forEach((frame, i) => {
    drawFrame(ctx, image, frame, { ...options, width, height });
    const { data } = ctx.getImageData(0, 0, width, height);
    const palette = quantize(data, 256);
    gif.writeFrame(applyPalette(data, palette), width, height, {
      palette,
      delay: frameDelay(i, frames.length, delay),
    });
  });

  gif.finish();
  return new Blob([gif.bytes()], { type: "image/gif" });
}
