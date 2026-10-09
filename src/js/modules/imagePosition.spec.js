import imagePosition from "./imagePosition";
import mockEvent from "./utils";

beforeEach(() => {
  document.body.innerHTML = `
    <img class="zoom__box"></img>
  `;
});

afterEach(() => {
  document.body.innerHTML = "";
});

test("mouse move", () => {
  const mockMouseEnter = mockEvent(".zoom__box", "mousedown");
  const mockMouseMove = mockEvent(document, "mousemove");

  imagePosition();

  const image = document.querySelector("img");

  mockMouseEnter.cb({
    preventDefault: () => {},
    target: image,
    pageX: 10,
    pageY: 10,
  });
  mockMouseMove.cb({ preventDefault: () => {}, pageX: 100, pageY: 50 });

  expect(image.style.marginLeft).toBe("90px");
  expect(image.style.marginTop).toBe("40px");
});

test("touch move", () => {
  window.orientation = "landscape";

  const mockTouchStart = mockEvent(".zoom__box", "touchstart");
  const mockTouchMove = mockEvent(document, "touchmove");

  imagePosition();

  const image = document.querySelector("img");

  mockTouchStart.cb({
    preventDefault: () => {},
    target: image,
    pageX: 10,
    pageY: 10,
  });
  mockTouchMove.cb({ preventDefault: () => {}, pageX: 100, pageY: 50 });

  expect(image.style.marginLeft).toBe("90px");
  expect(image.style.marginTop).toBe("40px");
});

test("if element is not image is not moving", () => {
  document.body.innerHTML = `
    <div class="zoom__box"></div>
  `;

  const mockTouchStart = mockEvent(".zoom__box", "touchstart");
  const mockTouchMove = mockEvent(document, "touchmove");

  imagePosition();

  const noImage = document.querySelector("div");

  mockTouchStart.cb({
    preventDefault: () => {},
    target: noImage,
    pageX: 10,
    pageY: 10,
  });
  expect(mockTouchMove.cb).not.toBe("function");
});
