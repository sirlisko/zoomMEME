import { resizeFrame } from "./frames";

const DRAG_THRESHOLD = 4;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function pointerFraction(source, e) {
  const rect = source.getBoundingClientRect();
  return [
    clamp((e.clientX - rect.left) / rect.width, 0, 1),
    clamp((e.clientY - rect.top) / rect.height, 0, 1),
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

function setAt(list, index, value) {
  const next = [...list];
  next[index] = value;
  return next;
}

// Pressing an outline and moving drags that frame; pressing its corner handle
// resizes it. A press that never moves is left to the click.
export default function bindFrameDrag(root, store, getFrames) {
  const source = root.querySelector(".source");
  const marks = root.querySelector(".source__marks");
  let drag = null;
  let dragged = false;

  function moveFrame(e) {
    const [px, py] = pointerFraction(source, e);
    const { focusX, focusY, offsets } = store.get();
    const { box, grab } = drag;
    const cx = clamp(px - grab[0], box.w / 2, 1 - box.w / 2);
    const cy = clamp(py - grab[1], box.h / 2, 1 - box.h / 2);
    store.set({
      offsets: setAt(offsets, drag.index, [cx - focusX, cy - focusY]),
    });
  }

  function resize(e) {
    const { image, zoom, count, adjustments, offsets, focusX, focusY } =
      store.get();
    const { adjustment, center } = resizeFrame({
      width: image.naturalWidth,
      height: image.naturalHeight,
      zoom,
      count,
      adjustments,
      index: drag.index,
      anchor: [drag.box.left, drag.box.top],
      pointer: pointerFraction(source, e),
    });
    store.set({
      adjustments: setAt(adjustments, drag.index, adjustment),
      offsets: setAt(offsets, drag.index, [
        center[0] - focusX,
        center[1] - focusY,
      ]),
    });
  }

  source.addEventListener("pointerdown", (e) => {
    const handle = e.target.closest(".source__handles span");
    const resizing = Boolean(handle);
    const index = resizing ? Number(handle.dataset.index) : frameAt(marks, e);
    // Resizing never doubles as a click, so mark it dragged from the start.
    dragged = resizing;
    drag = null;
    if (index < 0) return;
    const frame = getFrames()[index];
    const { naturalWidth: w, naturalHeight: h } = store.get().image;
    const box = {
      left: frame.sx / w,
      top: frame.sy / h,
      w: frame.sw / w,
      h: frame.sh / h,
    };
    const [px, py] = pointerFraction(source, e);
    drag = {
      index,
      resizing,
      box,
      x: e.clientX,
      y: e.clientY,
      grab: [px - (box.left + box.w / 2), py - (box.top + box.h / 2)],
    };
    source.setPointerCapture(e.pointerId);
    marks.children[index].classList.add("is-active");
  });

  source.addEventListener("pointermove", (e) => {
    if (!drag) return;
    if (
      !dragged &&
      Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < DRAG_THRESHOLD
    ) {
      return;
    }
    dragged = true;
    if (drag.resizing) resize(e);
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
