import { FRAME_RATIO, formatZoom } from "./frames";

export const OUTPUT_WIDTH = 800;
const CREDIT = "zoomme.me";

function drawOverlay(ctx, { width, height, zoom, date }) {
  const size = Math.round(width * 0.045);
  const pad = Math.round(width * 0.025);
  const dot = size * 0.25;

  ctx.save();
  ctx.font = `${size}px VT323, monospace`;
  ctx.shadowColor = "rgb(0 0 0 / 0.8)";
  ctx.shadowOffsetX = Math.max(1, size / 14);
  ctx.shadowOffsetY = Math.max(1, size / 14);

  ctx.fillStyle = "#ff3b30";
  ctx.beginPath();
  ctx.arc(pad + dot, pad + size * 0.45, dot, 0, Math.PI * 2);
  ctx.fill();

  ctx.textBaseline = "top";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("REC", pad + dot * 2.6, pad);
  ctx.textAlign = "right";
  ctx.fillStyle = "#ffe14d";
  ctx.fillText(date, width - pad, pad);

  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`ZOOM ${formatZoom(zoom)}`, pad, height - pad);
  ctx.restore();
}

function drawCredit(ctx, { width, height }) {
  const size = Math.round(width * 0.022);
  const pad = Math.round(width * 0.015);

  ctx.save();
  ctx.font = `${size}px "Atkinson Hyperlegible", sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#000000";
  ctx.fillText(CREDIT, width - pad + 1, height - pad + 1);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(CREDIT, width - pad, height - pad);
  ctx.restore();
}

export function drawFrame(ctx, image, frame, options) {
  const { width, height } = options;
  ctx.drawImage(
    image,
    frame.sx,
    frame.sy,
    frame.sw,
    frame.sh,
    0,
    0,
    width,
    height,
  );
  if (options.overlay) drawOverlay(ctx, { ...options, zoom: frame.zoom });
  if (options.credit) drawCredit(ctx, options);
}

export function drawStack(canvas, image, frames, options) {
  const width = OUTPUT_WIDTH;
  const height = width * FRAME_RATIO;
  canvas.width = width;
  canvas.height = height * frames.length;
  const ctx = canvas.getContext("2d");

  frames.forEach((frame, i) => {
    ctx.save();
    ctx.translate(0, i * height);
    drawFrame(ctx, image, frame, {
      ...options,
      width,
      height,
      credit: options.credit && i === frames.length - 1,
    });
    ctx.restore();
  });
}
