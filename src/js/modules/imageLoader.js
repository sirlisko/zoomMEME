import errorHandler, { clearError } from "./errorHandler";

const UNSUPPORTED =
  "That file type isn't supported. Choose a JPEG, PNG, GIF or WebP image.";

function firstImage(files) {
  return Array.from(files).find((file) =>
    /^image\/(jpeg|png|gif|webp)$/.test(file.type),
  );
}

export default function onImage(callback) {
  const input = document.querySelector("#holder input");

  function read(files) {
    const image = firstImage(files);
    if (!image) {
      errorHandler(new Error(UNSUPPORTED));
      return;
    }
    clearError();
    callback(image);
  }

  // dragenter/dragleave fire for every child element, so count them.
  let dragDepth = 0;
  function setDragging(depth) {
    dragDepth = depth;
    document.body.classList.toggle("is-dragging", dragDepth > 0);
  }

  document.addEventListener("dragenter", () => setDragging(dragDepth + 1));
  document.addEventListener("dragleave", () => setDragging(dragDepth - 1));
  document.addEventListener("dragover", (e) => e.preventDefault());
  document.addEventListener("drop", (e) => {
    e.preventDefault();
    setDragging(0);
    read(e.dataTransfer.files);
  });
  document.addEventListener("paste", (e) => {
    const { files } = e.clipboardData;
    if (files.length) read(files);
  });
  input.addEventListener("change", () => {
    read(input.files);
    input.value = "";
  });
}
