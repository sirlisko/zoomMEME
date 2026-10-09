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

function download(canvas) {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/jpeg");
  link.download = "zoommeme.jpg";
  link.click();
}

function saveCanvas({ currentTarget: btn }) {
  const zoomBox = document.querySelector(".zoom__box");
  const isWatermarkAllowed = document.getElementById("watermark").checked;
  zoomBox.classList.add("zoom__box--save");

  html2canvas(zoomBox)
    .then((canvas) => {
      download(
        isWatermarkAllowed ? addWatermark(canvas, watermarkText) : canvas,
      );
      btn.textContent = "Save Image";
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
