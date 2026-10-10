import { encodeGif, SPEEDS } from "./gif";

const SETTLE_MS = 600;

export function gifFile({ image, frames, options, speed }) {
  const blob = encodeGif(image, frames, options, SPEEDS[speed]);
  return new File([blob], "zoommeme.gif", { type: "image/gif" });
}

function keyOf({ image, frames, options, speed }) {
  return JSON.stringify([image.src, frames, options, speed]);
}

// iOS only lets share() run shortly after a tap, so the GIF is encoded once
// the controls settle instead of after the tap.
export default function createGifCache() {
  let timer;
  let key;
  let file;

  return {
    prepare(meme) {
      const next = keyOf(meme);
      if (next === key) return;
      clearTimeout(timer);
      key = next;
      file = null;
      timer = setTimeout(() => {
        file = gifFile(meme);
      }, SETTLE_MS);
    },
    cancel() {
      clearTimeout(timer);
      key = null;
      file = null;
    },
    get(meme) {
      return file && key === keyOf(meme) ? file : null;
    },
  };
}
