import computeFrames, {
  adjustmentForWidth,
  resizeFrame,
  zoomLevels,
} from "./frames";

const landscape = { width: 1000, height: 500, focusX: 0.5, focusY: 0.5 };

test("zoom levels step evenly from 1x to the maximum", () => {
  const levels = zoomLevels(8, 4);

  [1, 2, 4, 8].forEach((level, i) => {
    expect(levels[i]).toBeCloseTo(level);
  });
});

test("adjustments scale a single frame", () => {
  expect(zoomLevels(8, 4, [0, 1, 0, 0])[1]).toBeCloseTo(2.5);
});

test("zoom never goes below 1x", () => {
  expect(zoomLevels(8, 4, [-6])[0]).toBe(1);
});

test("the first frame covers a 2:1 photo entirely", () => {
  const [first] = computeFrames({ ...landscape, zoom: 8, count: 4 });

  expect(first).toMatchObject({ sx: 0, sy: 0, sw: 1000, sh: 500 });
});

test("later frames centre on the focus point", () => {
  const frames = computeFrames({ ...landscape, zoom: 8, count: 4 });
  const last = frames[3];

  expect(last.sw).toBeCloseTo(125);
  expect(last.sx + last.sw / 2).toBeCloseTo(500);
  expect(last.sy + last.sh / 2).toBeCloseTo(250);
});

test("crops stay inside the photo near its edges", () => {
  const frames = computeFrames({
    ...landscape,
    focusX: 0,
    focusY: 1,
    zoom: 4,
    count: 3,
  });

  for (const f of frames) {
    expect(f.sx).toBe(0);
    expect(f.sy + f.sh).toBeCloseTo(500);
  }
});

test("a portrait photo starts from its full width", () => {
  const [first] = computeFrames({
    width: 600,
    height: 900,
    focusX: 0.5,
    focusY: 0.5,
    zoom: 4,
    count: 3,
  });

  expect(first.sw).toBe(600);
  expect(first.sh).toBe(300);
  expect(first.sy).toBe(300);
});

test("a very wide photo starts from its full height", () => {
  const [first] = computeFrames({
    width: 3000,
    height: 500,
    focusX: 0.5,
    focusY: 0.5,
    zoom: 4,
    count: 3,
  });

  expect(first.sh).toBeCloseTo(500);
  expect(first.sw).toBeCloseTo(1000);
  expect(first.sx).toBeCloseTo(1000);
});

test("an offset moves a single frame off the focus point", () => {
  const frames = computeFrames({
    ...landscape,
    zoom: 8,
    count: 4,
    offsets: [undefined, undefined, undefined, [0.25, 0]],
  });

  expect(frames[3].sx + frames[3].sw / 2).toBeCloseTo(750);
  expect(frames[2].sx + frames[2].sw / 2).toBeCloseTo(500);
});

test("adjustmentForWidth round-trips through computeFrames", () => {
  const adjustment = adjustmentForWidth({
    ...landscape,
    zoom: 8,
    count: 4,
    index: 2,
    fraction: 0.5,
  });
  const frames = computeFrames({
    ...landscape,
    zoom: 8,
    count: 4,
    adjustments: [0, 0, adjustment],
  });

  expect(frames[2].sw).toBeCloseTo(500);
});

test("adjustmentForWidth stays within the fine-tune range", () => {
  const args = { ...landscape, zoom: 8, count: 4, index: 3 };

  expect(adjustmentForWidth({ ...args, fraction: 0.001 })).toBe(6);
  expect(adjustmentForWidth({ ...args, fraction: 5 })).toBe(-6);
});

test("resizeFrame keeps the top-left corner in place", () => {
  const args = { ...landscape, zoom: 8, count: 4, adjustments: [], index: 2 };
  const { adjustment, center } = resizeFrame({
    ...args,
    anchor: [0.2, 0.3],
    pointer: [0.6, 0.4],
  });
  const [frame] = computeFrames({
    ...landscape,
    zoom: 8,
    count: 4,
    adjustments: [0, 0, adjustment],
    offsets: [undefined, undefined, [center[0] - 0.5, center[1] - 0.5]],
  }).slice(2);

  expect(frame.sx).toBeCloseTo(200);
  expect(frame.sy).toBeCloseTo(150);
  expect(frame.sw).toBeCloseTo(400);
});

test("resizeFrame follows whichever axis the pointer pulls further", () => {
  const args = { ...landscape, zoom: 8, count: 4, adjustments: [], index: 3 };
  const { center } = resizeFrame({
    ...args,
    anchor: [0.1, 0.1],
    pointer: [0.2, 0.5],
  });

  expect(center[1]).toBeCloseTo(0.3);
});

test("resizeFrame cannot grow frame 1 past the photo", () => {
  const { adjustment } = resizeFrame({
    ...landscape,
    zoom: 8,
    count: 4,
    adjustments: [],
    index: 0,
    anchor: [0, 0],
    pointer: [1, 1],
  });

  expect(zoomLevels(8, 4, [adjustment])[0]).toBe(1);
});
