import { bindActions } from "./actions";
import { bindControls, renderControls } from "./controls";
import { drawStack } from "./draw";
import computeFrames from "./frames";
import osdDate from "./osdDate";
import { bindSource, renderSource, showSource } from "./sourceView";
import createStore from "./store";

const CANVAS_FONTS = ['36px "VT323"', '18px "Atkinson Hyperlegible"'];

function framesFor(state) {
  return computeFrames({
    width: state.image.naturalWidth,
    height: state.image.naturalHeight,
    focusX: state.focusX,
    focusY: state.focusY,
    zoom: state.zoom,
    count: state.count,
    adjustments: state.adjustments,
  });
}

export default function createEditor() {
  const root = document.querySelector(".editor");
  const landing = document.querySelector(".landing");
  const newPhoto = document.querySelector(".new-photo");
  const canvas = root.querySelector(".preview");
  const store = createStore({
    image: null,
    focusX: 0.5,
    focusY: 0.5,
    zoom: 8,
    count: 4,
    adjustments: [],
    overlay: true,
    credit: true,
  });

  store.subscribe((state) => {
    if (!state.image) return;
    const frames = framesFor(state);
    renderSource(root, state, frames);
    renderControls(root, state, frames);
    drawStack(canvas, state.image, frames, {
      overlay: state.overlay,
      credit: state.credit,
      date: osdDate(),
    });
  });

  bindSource(root, store);
  bindControls(root, store);
  bindActions(root, canvas);

  newPhoto.addEventListener("click", () => {
    URL.revokeObjectURL(store.get().image.src);
    store.set({ image: null });
    root.querySelector(".status").textContent = "";
    root.hidden = true;
    newPhoto.hidden = true;
    landing.hidden = false;
  });

  return {
    open(image) {
      landing.hidden = true;
      root.hidden = false;
      newPhoto.hidden = false;
      showSource(root, image);
      store.set({ image, focusX: 0.5, focusY: 0.5, adjustments: [] });
      // Canvas text falls back to a system font until the webfonts load.
      Promise.all(CANVAS_FONTS.map((font) => document.fonts?.load(font))).then(
        () => store.set({}),
      );
    },
  };
}
