import { adjustmentForWidth } from "./frames";

const DRAG_THRESHOLD = 4;

function clamp01(value) {
  return Math.min(Math.max(value, 0), 1);
}

export function pointerFraction(source, e) {
  const rect = source.getBoundingClientRect();
  return [
    clamp01((e.clientX - rect.left) / rect.width),
    clamp01((e.clientY - rect.top) / rect.height),
  ];
}

// The smallest outline under the pointer wins, as later frames sit inside earlier ones.
function frameAt(marks, e) {
  let hit = -1;
  let hitArea = Infinity;
  [...marks.children].forEach((mark, i) => {
    if (mark.dataset.fixed) return;
    const r = mark.getBoundingClientRect();
    const inside =
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom;
    if (inside && r.width * r.height < hitArea) {
      hit = i;
      hitArea = r.width * r.height;
    }
  });
  return hit;
}

// Pressing an outline and moving drags that frame; the corner handle of the
// selected frame zooms it. A press that never moves is left to the click.
export default function bindFrameDrag(root, store, getFrames) {
  const source = root.querySelector(".source");
  const marks = root.querySelector(".source__marks");
  const handle = root.querySelector(".source__handle");
  let drag = null;
  let dragged = false;

  function select(index) {
    if (store.get().selected !== index) store.set({ selected: index });
  }

  function moveFrame(e) {
    const [px, py] = pointerFraction(source, e);
    const { focusX, focusY, offsets } = store.get();
    const next = [...offsets];
    next[drag.index] = [px - focusX, py - focusY];
    store.set({ offsets: next });
  }

  function zoomFrame(e) {
    const { image, zoom, count, adjustments } = store.get();
    const [px] = pointerFraction(source, e);
    const next = [...adjustments];
    next[drag.index] = adjustmentForWidth({
      width: image.naturalWidth,
      height: image.naturalHeight,
      zoom,
      count,
      index: drag.index,
      fraction: 2 * Math.abs(px - drag.centerX),
    });
    store.set({ adjustments: next });
  }

  source.addEventListener("pointerdown", (e) => {
    const resizing = e.target === handle;
    const index = resizing ? store.get().selected : frameAt(marks, e);
    // Resizing never doubles as a click, so mark it dragged from the start.
    dragged = resizing;
    drag = null;
    if (index < 0) return;
    const frame = getFrames()[index];
    const { image } = store.get();
    drag = {
      index,
      resizing,
      x: e.clientX,
      y: e.clientY,
      centerX: (frame.sx + frame.sw / 2) / image.naturalWidth,
    };
    select(index);
    source.setPointerCapture(e.pointerId);
    marks.children[index].classList.add("is-active");
  });

  source.addEventListener("pointermove", (e) => {
    if (!drag) {
      if (e.pointerType !== "mouse") return;
      const hover = frameAt(marks, e);
      if (hover > 0) select(hover);
      return;
    }
    if (
      !dragged &&
      Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < DRAG_THRESHOLD
    ) {
      return;
    }
    dragged = true;
    if (drag.resizing) zoomFrame(e);
    else moveFrame(e);
  });

  function endDrag() {
    drag = null;
    for (const mark of marks.children) mark.classList.remove("is-active");
  }
  source.addEventListener("pointerup", endDrag);
  source.addEventListener("pointercancel", endDrag);

  return {
    consumeDrag() {
      const was = dragged;
      dragged = false;
      return was;
    },
  };
}
