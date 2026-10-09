import {
  canCopy,
  canShare,
  copyPng,
  download,
  jpegFile,
  share,
} from "./exporter";
import { encodeGif, SPEEDS } from "./gif";

function nextPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function memeFile(meme, canvas, status) {
  if (meme.output !== "gif") return jpegFile(canvas);
  status.textContent = "Making your GIF…";
  await nextPaint();
  const { image, frames, options, speed } = meme;
  const blob = encodeGif(image, frames, options, SPEEDS[speed]);
  return new File([blob], "zoommeme.gif", { type: "image/gif" });
}

export function bindActions(root, canvas, currentMeme) {
  const status = root.querySelector(".status");

  root.querySelector(".download").addEventListener("click", async () => {
    try {
      const file = await memeFile(currentMeme(), canvas, status);
      download(file);
      status.textContent = `Downloaded ${file.name}`;
    } catch {
      status.textContent = "Couldn't create the image. Try again.";
    }
  });

  root.querySelector(".share").addEventListener("click", async () => {
    try {
      await share(await memeFile(currentMeme(), canvas, status));
      status.textContent = "Shared";
    } catch (err) {
      status.textContent =
        err.name === "AbortError"
          ? ""
          : "Couldn't share the image. Download it instead.";
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
  const sharing = canShare();
  const downloadButton = root.querySelector(".download");
  downloadButton.textContent = gif ? "Download GIF" : "Download JPG";
  downloadButton.classList.toggle("btn--ghost", sharing);
  root.querySelector(".share").hidden = !sharing;
  // Browsers can only put PNGs on the clipboard, so GIFs are download-only.
  root.querySelector(".copy").hidden = gif || !canCopy();
}
