import attachToDOM from "./modules/attachToDom";
import showDemo from "./modules/demo";
import isTouchDevice from "./modules/device";
import errorHandler from "./modules/errorHandler";
import imageLoader from "./modules/imageLoader";
import imagePosition from "./modules/imagePosition";
import imageRender from "./modules/imageRender";
import imageSaver from "./modules/imageSaver";
import imageZoom from "./modules/imageZoom";

showDemo();

if (isTouchDevice()) {
  document.body.classList.add("mobile");
}

imageLoader
  .then(imageRender)
  .then(attachToDOM)
  .then(imagePosition)
  .then(imageZoom)
  .then(imageSaver)
  .catch(errorHandler);
