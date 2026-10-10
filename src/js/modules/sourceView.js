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
    store.set({ offsets: [], adjustments: [] });
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

function syncChildren(container, count) {
  while (container.children.length < count) {
    const child = document.createElement("span");
    child.dataset.index = container.children.length;
    container.append(child);
  }
  while (container.children.length > count) {
    container.lastChild.remove();
  }
}

export function renderSource(root, state, frames) {
  const { naturalWidth: w, naturalHeight: h } = state.image;
  const marks = root.querySelector(".source__marks");
  const handles = root.querySelector(".source__handles");
  syncChildren(marks, frames.length);
  syncChildren(handles, frames.length);

  frames.forEach((frame, i) => {
    Object.assign(marks.children[i].style, {
      left: percent(frame.sx / w),
      top: percent(frame.sy / h),
      width: percent(frame.sw / w),
      height: percent(frame.sh / h),
    });
    // A crop that already fills the photo has nowhere to move.
    marks.children[i].dataset.fixed = frame.sw >= w && frame.sh >= h ? "1" : "";
    Object.assign(handles.children[i].style, {
      left: percent((frame.sx + frame.sw) / w),
      top: percent((frame.sy + frame.sh) / h),
    });
  });

  root.querySelector(".reset-frames").hidden = ![
    ...state.offsets,
    ...state.adjustments,
  ].some(Boolean);

  const focus = root.querySelector(".source__focus");
  focus.style.left = percent(state.focusX);
  focus.style.top = percent(state.focusY);
}
