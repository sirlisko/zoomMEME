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
    const width = img.offsetWidth;
    img.style.width = `${width + inOrOut(ctrl) * 50}px`;
  });
}

export default imageZoom;
