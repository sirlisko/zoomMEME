import { formatZoom } from "./frames";

const MAX_ADJUST = 6;

function fineTuneRow(index) {
  const row = document.createElement("li");
  row.className = "fine-tune__row";
  row.innerHTML = `
    <span class="fine-tune__name">Frame ${index + 1}</span>
    <button type="button" class="chip chip--ghost" data-index="${index}" data-step="-1" aria-label="Zoom frame ${index + 1} out">−</button>
    <output class="fine-tune__level"></output>
    <button type="button" class="chip chip--ghost" data-index="${index}" data-step="1" aria-label="Zoom frame ${index + 1} in">+</button>`;
  return row;
}

function renderFineTune(list, frames) {
  if (list.children.length !== frames.length - 1) {
    list.replaceChildren(...frames.slice(1).map((_, i) => fineTuneRow(i + 1)));
  }
  frames.slice(1).forEach((frame, i) => {
    list.children[i].querySelector("output").textContent = formatZoom(
      frame.zoom,
    );
  });
}

export function bindControls(root, store) {
  const range = root.querySelector(".zoom-range");
  range.addEventListener("input", () =>
    store.set({ zoom: Number(range.value) }),
  );

  root.querySelector(".frame-count").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    store.set({ count: Number(chip.value), adjustments: [] });
  });

  root.querySelector(".fine-tune__list").addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const { index, step } = button.dataset;
    const adjustments = [...store.get().adjustments];
    const next = (adjustments[index] ?? 0) + Number(step);
    adjustments[index] = Math.min(Math.max(next, -MAX_ADJUST), MAX_ADJUST);
    store.set({ adjustments });
  });

  root
    .querySelector(".overlay-toggle")
    .addEventListener("change", (e) =>
      store.set({ overlay: e.target.checked }),
    );
  root
    .querySelector(".credit-toggle")
    .addEventListener("change", (e) => store.set({ credit: e.target.checked }));
}

export function renderControls(root, state, frames) {
  root.querySelector(".zoom-range").value = state.zoom;
  root.querySelector(".zoom-value").textContent = formatZoom(state.zoom);
  for (const chip of root.querySelectorAll(".frame-count .chip")) {
    chip.setAttribute(
      "aria-pressed",
      String(Number(chip.value) === state.count),
    );
  }
  renderFineTune(root.querySelector(".fine-tune__list"), frames);
}
