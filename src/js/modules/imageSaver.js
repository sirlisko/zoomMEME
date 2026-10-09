import html2canvas from "html2canvas";

const watermarkText = "https://zoomme.me";

function addWatermark(canvas, text) {
  const context = canvas.getContext("2d");
  const x = 8;
  const y = canvas.height - x;
  context.font = "16px verdana";
  context.globalAlpha = 0.5;
  context.fillStyle = "white";
  context.fillText(text, x, y);
  context.fillStyle = "black";
  context.fillText(text, x + 1, y + 1);
  return canvas;
}

function saveCanvas({ target }) {
  const btn = target;
  const zoomBox = document.querySelector(".zoom__box");
  const isWatermarkAllowed = document.getElementById("watermark").checked;
  zoomBox.classList.add("zoom__box--save");

  html2canvas(zoomBox)
    .then((canvas) => {
      const editedCanvas = isWatermarkAllowed
        ? addWatermark(canvas, watermarkText)
        : canvas;
      btn.href = editedCanvas.toDataURL("image/jpeg");
      btn.download = "zoommeme";
      btn.textContent = "Download Image";
    })
    .catch(() => {
      btn.textContent = "Save failed, try again";
    })
    .finally(() => zoomBox.classList.remove("zoom__box--save"));
}

function saveImage() {
  const save = document.querySelector(".zoom__save");
  save.addEventListener("click", saveCanvas);
}

export default saveImage;
