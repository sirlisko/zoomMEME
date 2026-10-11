import bindFrameDrag, { pointerFraction } from "./frameDrag";
import createStore from "./store";

function rect(left, top, width, height) {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  };
}

function pointer(target, type, clientX, clientY) {
  target.dispatchEvent(
    new PointerEvent(type, { clientX, clientY, pointerId: 1, bubbles: true }),
  );
}

let root;
let source;
let store;
let drag;

beforeEach(() => {
  document.body.innerHTML = `
    <div class="root">
      <div class="source">
        <div class="source__marks"><span data-fixed="1"></span><span></span></div>
        <div class="source__handles"><span data-index="1"></span></div>
      </div>
    </div>`;
  root = document.querySelector(".root");
  source = root.querySelector(".source");
  source.setPointerCapture = () => {};
  source.getBoundingClientRect = () => rect(0, 0, 1000, 500);
  const [whole, inner] = root.querySelector(".source__marks").children;
  whole.getBoundingClientRect = () => rect(0, 0, 1000, 500);
  inner.getBoundingClientRect = () => rect(250, 125, 500, 250);

  store = createStore({
    image: { naturalWidth: 1000, naturalHeight: 500 },
    zoom: 4,
    count: 2,
    focusX: 0.5,
    focusY: 0.5,
    adjustments: [0, 0],
    offsets: [
      [0, 0],
      [0, 0],
    ],
  });
  const frames = [
    { sx: 0, sy: 0, sw: 1000, sh: 500 },
    { sx: 250, sy: 125, sw: 500, sh: 250 },
  ];
  drag = bindFrameDrag(root, store, () => frames);
});

test("pointer position is a clamped fraction of the photo", () => {
  expect(pointerFraction(source, { clientX: 250, clientY: 600 })).toEqual([
    0.25, 1,
  ]);
  expect(pointerFraction(source, { clientX: -10, clientY: 125 })).toEqual([
    0, 0.25,
  ]);
});

test("dragging an outline moves that frame", () => {
  pointer(source, "pointerdown", 500, 250);
  pointer(source, "pointermove", 600, 250);
  pointer(source, "pointerup", 600, 250);

  const [x, y] = store.get().offsets[1];
  expect(x).toBeCloseTo(0.1);
  expect(y).toBeCloseTo(0);
  expect(drag.consumeDrag()).toBe(true);
  expect(drag.consumeDrag()).toBe(false);
});

test("a dragged frame stays inside the photo", () => {
  pointer(source, "pointerdown", 500, 250);
  pointer(source, "pointermove", 1000, 500);

  const [x, y] = store.get().offsets[1];
  expect(x).toBeCloseTo(0.25);
  expect(y).toBeCloseTo(0.25);
});

test("a press that barely moves is left to the click", () => {
  pointer(source, "pointerdown", 500, 250);
  pointer(source, "pointermove", 502, 251);
  pointer(source, "pointerup", 502, 251);

  expect(store.get().offsets[1]).toEqual([0, 0]);
  expect(drag.consumeDrag()).toBe(false);
});

test("the frame covering the whole photo cannot be dragged", () => {
  const before = store.get();
  pointer(source, "pointerdown", 100, 100);
  pointer(source, "pointermove", 300, 300);

  expect(store.get()).toBe(before);
});

test("pressing a corner handle resizes and never counts as a click", () => {
  const handle = root.querySelector(".source__handles span");
  pointer(handle, "pointerdown", 750, 375);

  expect(drag.consumeDrag()).toBe(true);

  pointer(handle, "pointerdown", 750, 375);
  pointer(source, "pointermove", 900, 450);

  expect(store.get().adjustments[1]).not.toBe(0);
});
