import errorHandler, { clearError } from "./errorHandler";

const UNSUPPORTED =
  "That file type isn't supported. Choose a JPEG, PNG, GIF or WebP image.";

function firstImage(files) {
  return Array.from(files).find((file) =>
    /^image\/(jpeg|png|gif|webp)$/.test(file.type),
  );
}

export default function onImage(callback) {
  const holder = document.getElementById("holder");
  const input = holder.querySelector("input");

  function read(files) {
    const image = firstImage(files);
    if (!image) {
      errorHandler(new Error(UNSUPPORTED));
      return;
    }
    clearError();
    callback(image);
  }

  holder.addEventListener("dragover", (e) => e.preventDefault());
  holder.addEventListener("drop", (e) => {
    e.preventDefault();
    read(e.dataTransfer.files);
  });
  input.addEventListener("change", () => {
    read(input.files);
    input.value = "";
  });
}
