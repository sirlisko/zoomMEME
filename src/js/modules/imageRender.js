function renderImage([file]) {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      const image = new Image();
      image.src = event.target.result;

      resolve(image);
    };

    reader.onerror = () => reject(new Error("Unable to read the file."));

    reader.readAsDataURL(file);
  });
}

export default renderImage;
