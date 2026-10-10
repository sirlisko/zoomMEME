import bindFrameDrag, { pointerFraction } from "./frameDrag";

const NUDGE = {
  ArrowLeft: [-0.02, 0],
  ArrowRight: [0.02, 0],
  ArrowUp: [0, -0.02],
  ArrowDown: [0, 0.02],
};

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

function percent(value) {
  return `${value * 100}%`;
}

export function bindSource(root, store, getFrames) {
  const source = root.querySelector(".source");
  const { consumeDrag } = bindFrameDrag(root, store, getFrames);

  root.querySelector(".reset-frames").addEventListener("click", () => {
    store.set({ offsets: [] });
  });

  source.addEventListener("click", (e) => {
    // Enter and Space also fire click, with no pointer position to use.
    if (e.detail === 0 || consumeDrag()) return;
    const [focusX, focusY] = pointerFraction(source, e);
    store.set({ focusX, focusY, offsets: [] });
  });

  source.addEventListener("keydown", (e) => {
    const move = NUDGE[e.key];
    if (!move) return;
    e.preventDefault();
    const { focusX, focusY } = store.get();
    store.set({
      focusX: clamp01(focusX + move[0]),
      focusY: clamp01(focusY + move[1]),
    });
  });
}

export function showSource(root, image) {
  const { naturalWidth: w, naturalHeight: h } = image;
  const source = root.querySelector(".source");
  source.style.aspectRatio = `${w} / ${h}`;
  source.style.width = `min(100%, ${(70 * w) / h}vh)`;
  root.querySelector(".source__photo").src = image.src;
}

export function renderSource(root, state, frames) {
  const { naturalWidth: w, naturalHeight: h } = state.image;
  const marks = root.querySelector(".source__marks");

  while (marks.children.length < frames.length) {
    marks.append(document.createElement("span"));
  }
  while (marks.children.length > frames.length) {
    marks.lastChild.remove();
  }

  frames.forEach((frame, i) => {
    Object.assign(marks.children[i].style, {
      left: percent(frame.sx / w),
      top: percent(frame.sy / h),
      width: percent(frame.sw / w),
      height: percent(frame.sh / h),
    });
    // A crop that already fills the photo has nowhere to move.
    marks.children[i].dataset.fixed = frame.sw >= w && frame.sh >= h ? "1" : "";
  });

  const handle = root.querySelector(".source__handle");
  const target = frames[state.selected];
  // Frame 1 is the baseline the others zoom from, so it has no handle.
  handle.hidden = !target || state.selected === 0;
  if (!handle.hidden) {
    handle.style.left = percent((target.sx + target.sw) / w);
    handle.style.top = percent((target.sy + target.sh) / h);
  }

  root.querySelector(".reset-frames").hidden = !state.offsets.some(Boolean);

  const focus = root.querySelector(".source__focus");
  focus.style.left = percent(state.focusX);
  focus.style.top = percent(state.focusY);
}
