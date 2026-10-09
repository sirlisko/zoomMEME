import showDemo from "./modules/demo";
import createEditor from "./modules/editor";
import errorHandler from "./modules/errorHandler";
import onImage from "./modules/imageLoader";
import imageRender from "./modules/imageRender";

showDemo();

const editor = createEditor();

onImage((file) => imageRender(file).then(editor.open).catch(errorHandler));
