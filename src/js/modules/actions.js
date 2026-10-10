import {
  canCopy,
  canShare,
  copyPng,
  download,
  jpegFile,
  share,
} from "./exporter";
import { gifFile } from "./gifCache";

function nextPaint() {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function memeFile(meme, canvas, status, gifCache) {
  if (meme.output !== "gif") return jpegFile(canvas);
  const ready = gifCache.get(meme);
  if (ready) return ready;
  status.textContent = "Making your GIF…";
  await nextPaint();
  return gifFile(meme);
}

export function bindActions(root, canvas, currentMeme, gifCache) {
  const status = root.querySelector(".status");

  root.querySelector(".download").addEventListener("click", async () => {
    try {
      const file = await memeFile(currentMeme(), canvas, status, gifCache);
      download(file);
      status.textContent = `Downloaded ${file.name}`;
    } catch {
      status.textContent = "Couldn't create the image. Try again.";
    }
  });

  root.querySelector(".share").addEventListener("click", async () => {
    try {
      await share(await memeFile(currentMeme(), canvas, status, gifCache));
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
