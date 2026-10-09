const JPEG_QUALITY = 0.92;

function toBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Export failed."))),
      type,
      quality,
    );
  });
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadJpg(canvas) {
  const blob = await toBlob(canvas, "image/jpeg", JPEG_QUALITY);
  downloadBlob(blob, "zoommeme.jpg");
}

export function canCopy() {
  return Boolean(navigator.clipboard?.write && window.ClipboardItem);
}

export function copyPng(canvas) {
  return navigator.clipboard.write([
    new ClipboardItem({ "image/png": toBlob(canvas, "image/png") }),
  ]);
}
