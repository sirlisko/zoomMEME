import imagePosition from "./imagePosition";
import mockEvent from "./utils";

const stubTouchDevice = (matches) => {
  window.matchMedia = vi.fn(() => ({ matches }));
};

const setSize = (element, width, height) => {
  Object.defineProperty(element, "offsetWidth", { value: width });
  Object.defineProperty(element, "offsetHeight", { value: height });
};

beforeEach(() => {
  stubTouchDevice(false);
  document.body.innerHTML = `
    <div class="zoom__box"><p><img></p></div>
  `;
  setSize(document.querySelector("p"), 300, 150);
  setSize(document.querySelector("img"), 300, 200);
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
  stubTouchDevice(true);

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

  stubTouchDevice(true);
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
  expect(mockTouchMove.cb).toBeUndefined();
});

test("keeps part of the image inside the frame", () => {
  const mockMouseDown = mockEvent(".zoom__box", "mousedown");
  const mockMouseMove = mockEvent(document, "mousemove");

  imagePosition();

  const image = document.querySelector("img");

  mockMouseDown.cb({
    preventDefault: () => {},
    target: image,
    pageX: 1,
    pageY: 1,
  });
  mockMouseMove.cb({ preventDefault: () => {}, pageX: 1000, pageY: 1000 });

  expect(image.style.marginLeft).toBe("250px");
  expect(image.style.marginTop).toBe("100px");

  mockMouseMove.cb({ preventDefault: () => {}, pageX: -1000, pageY: -1000 });

  expect(image.style.marginLeft).toBe("-250px");
  expect(image.style.marginTop).toBe("-150px");
});
