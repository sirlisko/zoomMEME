import { bindActions, renderActions } from "./actions";
import { bindControls, renderControls } from "./controls";
import { drawStack } from "./draw";
import computeFrames from "./frames";
import { SPEEDS } from "./gif";
import createGifCache from "./gifCache";
import createGifPreview from "./gifPreview";
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
    offsets: state.offsets,
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
    offsets: [],
    overlay: true,
    credit: true,
    output: "stacked",
    speed: "normal",
  });
  const gifPreview = createGifPreview(canvas);
  const gifCache = createGifCache();

  function currentMeme() {
    const state = store.get();
    return {
      image: state.image,
      frames: framesFor(state),
      options: {
        overlay: state.overlay,
        credit: state.credit,
        date: osdDate(),
      },
      output: state.output,
      speed: state.speed,
    };
  }

  store.subscribe((state) => {
    if (!state.image) {
      gifPreview.stop();
      gifCache.cancel();
      return;
    }
    const { image, frames, options } = currentMeme();
    renderSource(root, state, frames);
    renderControls(root, state, frames);
    renderActions(root, state);
    if (state.output === "gif") {
      gifPreview.play({ image, frames, options, delay: SPEEDS[state.speed] });
      gifCache.prepare({ image, frames, options, speed: state.speed });
    } else {
      gifPreview.stop();
      gifCache.cancel();
      drawStack(canvas, image, frames, options);
    }
  });

  bindSource(root, store, () => framesFor(store.get()));
  bindControls(root, store);
  bindActions(root, canvas, currentMeme, gifCache);

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
      store.set({
        image,
        focusX: 0.5,
        focusY: 0.5,
        adjustments: [],
        offsets: [],
      });
      // Canvas text falls back to a system font until the webfonts load.
      Promise.all(CANVAS_FONTS.map((font) => document.fonts?.load(font))).then(
        () => store.set({}),
      );
    },
  };
}
