import imageRender from "./imageRender";

const readAsDataURL = vi.fn();

let reader;

window.FileReader = class {
  readAsDataURL = readAsDataURL;

  constructor() {
    reader = this;
  }
};

test("should read the file", () => {
  imageRender(["foo"]);

  expect(readAsDataURL).toHaveBeenCalledWith("foo");
});

test("should reject when the file cannot be read", async () => {
  const result = imageRender(["foo"]);

  reader.onerror();

  await expect(result).rejects.toThrow("Unable to read the file.");
});
