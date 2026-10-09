const STEP = 50;
const MIN_WIDTH = 50;
const MAX_WIDTH = 3000;

function inOrOut(target) {
  return target.classList.contains("zoom__ctrl--in") ? 1 : -1;
}

function imageZoom() {
  const zoomBox = document.querySelector(".zoom__box");

  zoomBox.addEventListener("click", (e) => {
    const ctrl = e.target.closest(".zoom__ctrl");
    if (!ctrl) {
      return;
    }
    e.preventDefault();
    const img = ctrl.parentNode.querySelector("img");
    const width = img.offsetWidth + inOrOut(ctrl) * STEP;
    img.style.width = `${Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH)}px`;
  });
}

export default imageZoom;
