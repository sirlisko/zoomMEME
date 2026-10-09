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

export function bindSource(root, store) {
  const source = root.querySelector(".source");

  source.addEventListener("click", (e) => {
    // Enter and Space also fire click, with no pointer position to use.
    if (e.detail === 0) return;
    const rect = source.getBoundingClientRect();
    store.set({
      focusX: clamp01((e.clientX - rect.left) / rect.width),
      focusY: clamp01((e.clientY - rect.top) / rect.height),
    });
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

  while (marks.children.length < frames.length - 1) {
    marks.append(document.createElement("span"));
  }
  while (marks.children.length > frames.length - 1) {
    marks.lastChild.remove();
  }

  frames.slice(1).forEach((frame, i) => {
    Object.assign(marks.children[i].style, {
      left: percent(frame.sx / w),
      top: percent(frame.sy / h),
      width: percent(frame.sw / w),
      height: percent(frame.sh / h),
    });
  });

  const focus = root.querySelector(".source__focus");
  focus.style.left = percent(state.focusX);
  focus.style.top = percent(state.focusY);
}
