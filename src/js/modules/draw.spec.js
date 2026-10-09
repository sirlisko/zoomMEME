import { drawFrame, drawStack } from "./draw";

function fakeContext() {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillText: vi.fn(),
  };
}

const frame = { zoom: 2, sx: 10, sy: 20, sw: 300, sh: 150 };
const image = {};

test("draws the frame's crop to fill the frame", () => {
  const ctx = fakeContext();

  drawFrame(ctx, image, frame, { width: 800, height: 400 });

  expect(ctx.drawImage).toHaveBeenCalledWith(
    image,
    10,
    20,
    300,
    150,
    0,
    0,
    800,
    400,
  );
  expect(ctx.fillText).not.toHaveBeenCalled();
});

test("adds the camcorder overlay with the zoom level and date", () => {
  const ctx = fakeContext();

  drawFrame(ctx, image, frame, {
    width: 800,
    height: 400,
    overlay: true,
    date: "OCT 09 2026",
  });

  const texts = ctx.fillText.mock.calls.map(([text]) => text);
  expect(texts).toEqual(["REC", "OCT 09 2026", "ZOOM 2×"]);
});

test("stacks frames and credits only the last one", () => {
  const ctx = fakeContext();
  const canvas = { getContext: () => ctx };

  drawStack(canvas, image, [frame, frame, frame], { credit: true });

  expect(canvas.width).toBe(800);
  expect(canvas.height).toBe(1200);
  expect(ctx.drawImage).toHaveBeenCalledTimes(3);
  expect(ctx.translate).toHaveBeenLastCalledWith(0, 800);
  const credits = ctx.fillText.mock.calls.filter(([t]) => t === "zoomme.me");
  expect(credits).toHaveLength(2);
});
