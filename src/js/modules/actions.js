import { canCopy, copyPng, downloadJpg } from "./exporter";

export function bindActions(root, canvas) {
  const status = root.querySelector(".status");
  const copy = root.querySelector(".copy");
  copy.hidden = !canCopy();

  root.querySelector(".download").addEventListener("click", async () => {
    try {
      await downloadJpg(canvas);
      status.textContent = "Downloaded zoommeme.jpg";
    } catch {
      status.textContent = "Couldn't create the image. Try again.";
    }
  });

  copy.addEventListener("click", async () => {
    try {
      await copyPng(canvas);
      status.textContent = "Copied image";
    } catch {
      status.textContent = "Couldn't copy the image. Download it instead.";
    }
  });
}
