import imageRender from "./imageRender";

let image;

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:foo");
  window.Image = class {
    constructor() {
      image = this;
    }
  };
});

test("resolves once the image has loaded", async () => {
  const result = imageRender("file");
  expect(URL.createObjectURL).toHaveBeenCalledWith("file");
  expect(image.src).toBe("blob:foo");

  image.onload();

  await expect(result).resolves.toBe(image);
});

test("rejects when the image cannot be read", async () => {
  const result = imageRender("file");

  image.onerror();

  await expect(result).rejects.toThrow(
    "That image couldn't be read. Choose another one.",
  );
});
