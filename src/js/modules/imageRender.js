export default function imageRender(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("That image couldn't be read. Choose another one."));
    image.src = URL.createObjectURL(file);
  });
}
