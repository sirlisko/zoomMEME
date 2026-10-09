import imageRender from "./imageRender";

const readAsDataURL = vi.fn();

window.FileReader = class {
  readAsDataURL = readAsDataURL;
};

test("should read the file", () => {
  imageRender(["foo"]);

  expect(readAsDataURL).toHaveBeenCalledWith("foo");
});
