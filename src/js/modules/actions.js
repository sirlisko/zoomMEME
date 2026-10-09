import { canCopy, copyPng, downloadBlob, downloadJpg } from "./exporter";
import { encodeGif, SPEEDS } from "./gif";

function nextPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function downloadGif(meme, status) {
  status.textContent = "Making your GIF…";
  await nextPaint();
  const { image, frames, options, speed } = meme;
  downloadBlob(
    encodeGif(image, frames, options, SPEEDS[speed]),
    "zoommeme.gif",
  );
  status.textContent = "Downloaded zoommeme.gif";
}

async function downloadStack(canvas, status) {
  await downloadJpg(canvas);
  status.textContent = "Downloaded zoommeme.jpg";
}

export function bindActions(root, canvas, currentMeme) {
  const status = root.querySelector(".status");

  root.querySelector(".download").addEventListener("click", async () => {
    const meme = currentMeme();
    try {
      if (meme.output === "gif") await downloadGif(meme, status);
      else await downloadStack(canvas, status);
    } catch {
      status.textContent = "Couldn't create the image. Try again.";
    }
  });

  root.querySelector(".copy").addEventListener("click", async () => {
    try {
      await copyPng(canvas);
      status.textContent = "Copied image";
    } catch {
      status.textContent = "Couldn't copy the image. Download it instead.";
    }
  });
}

export function renderActions(root, state) {
  const gif = state.output === "gif";
  root.querySelector(".download").textContent = gif
    ? "Download GIF"
    : "Download JPG";
  // Browsers can only put PNGs on the clipboard, so GIFs are download-only.
  root.querySelector(".copy").hidden = gif || !canCopy();
}
