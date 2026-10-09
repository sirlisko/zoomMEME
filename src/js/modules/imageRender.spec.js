import imageRender from "./imageRender";

const readAsDataURL = vi.fn();

window.FileReader = vi.fn(function () {
  return { readAsDataURL };
});

test("should read the file", () => {
  imageRender(["foo"]);

  expect(readAsDataURL).toHaveBeenCalledWith("foo");
});
