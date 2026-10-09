import { drawFrame, OUTPUT_WIDTH } from "./draw";
import { FRAME_RATIO } from "./frames";
import { frameDelay } from "./gif";

export default function createGifPreview(canvas) {
  let timer;
  let tick = 0;
  let current;

  function draw() {
    const { image, frames, options } = current;
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_WIDTH * FRAME_RATIO;
    drawFrame(canvas.getContext("2d"), image, frames[tick % frames.length], {
      ...options,
      width: canvas.width,
      height: canvas.height,
    });
  }

  function schedule() {
    const count = current.frames.length;
    timer = setTimeout(
      () => {
        tick += 1;
        draw();
        schedule();
      },
      frameDelay(tick % count, count, current.delay),
    );
  }

  return {
    play(next) {
      current = next;
      draw();
      if (!timer) schedule();
    },
    stop() {
      clearTimeout(timer);
      timer = undefined;
      tick = 0;
    },
  };
}
