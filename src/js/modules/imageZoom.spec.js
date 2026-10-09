import imageZoom from "./imageZoom";

let image;
let zoomIn;
let zoomOut;

beforeEach(() => {
  document.body.innerHTML = `
    <div class="zoom__box">
      <img style="width: 100px">
      <button class="zoom__ctrl zoom__ctrl--in"></button>
      <button class="zoom__ctrl zoom__ctrl--out"></button>
    </div>
  `;

  image = document.querySelector("img");
  zoomIn = document.querySelector(".zoom__ctrl--in");
  zoomOut = document.querySelector(".zoom__ctrl--out");

  Object.defineProperty(image, "offsetWidth", {
    get: () => Number.parseInt(image.style.width, 10),
  });

  imageZoom();
});

test("zoom in and out by 50px", () => {
  zoomIn.click();
  expect(image.style.width).toBe("150px");

  zoomOut.click();
  zoomOut.click();
  expect(image.style.width).toBe("50px");
});

test("does not shrink below the minimum width", () => {
  image.style.width = "50px";

  zoomOut.click();

  expect(image.style.width).toBe("50px");
});

test("does not grow above the maximum width", () => {
  image.style.width = "3000px";

  zoomIn.click();

  expect(image.style.width).toBe("3000px");
});
