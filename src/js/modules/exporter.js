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

export async function jpegFile(canvas) {
  const blob = await toBlob(canvas, "image/jpeg", JPEG_QUALITY);
  return new File([blob], "zoommeme.jpg", { type: "image/jpeg" });
}

export function download(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function canCopy() {
  return Boolean(navigator.clipboard?.write && window.ClipboardItem);
}

export function copyPng(canvas) {
  return navigator.clipboard.write([
    new ClipboardItem({ "image/png": toBlob(canvas, "image/png") }),
  ]);
}

export function canShare() {
  const probe = new File([""], "zoommeme.jpg", { type: "image/jpeg" });
  return Boolean(navigator.canShare?.({ files: [probe] }));
}

export function share(file) {
  return navigator.share({ files: [file] });
}
