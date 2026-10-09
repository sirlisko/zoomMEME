import demoPhotos from "./demoPhotos";
import osdDate from "./osdDate";

function percent(value) {
  return `${Math.round(value * 1000) / 10}%`;
}

export default function showDemo(random = Math.random) {
  const photo = demoPhotos[Math.floor(random() * demoPhotos.length)];
  const img = document.querySelector(".demo__photo");
  img.src = photo.src;
  img.alt = `${photo.alt}, zooming in on its eye`;
  img.style.transformOrigin = `${percent(photo.focusX)} ${percent(photo.focusY)}`;

  document.querySelector(".demo .osd__date").textContent = osdDate();

  const credit = document.querySelector(".demo__credit a");
  credit.href = photo.source;
  credit.textContent = `Photo: Wikimedia Commons, ${photo.licence}`;
}
