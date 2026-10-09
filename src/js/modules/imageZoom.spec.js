import imageZoo from "./imageZoom";

test("zoom_in", () => {
  document.body.innerHTML = `
    <div class="zoom__box">
      <img offsetWidth="10" style="width: 10px">
      <div class="zoom__ctrl zoom__ctrl--in"></div>
      <div class="zoom__ctrl zoom__ctrl--out"></div>
    </div>
  `;

  imageZoo();

  const zoomCtrlIn = document.querySelector(".zoom__ctrl--in");
  const image = document.querySelector("img");

  expect(image.style.width).toBe("10px");

  zoomCtrlIn.click();
  expect(image.style.width).toBe("50px");

  zoomCtrlIn.click();
  expect(image.style.width).toBe("50px");
});
