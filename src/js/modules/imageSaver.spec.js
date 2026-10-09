import imageSaver from "./imageSaver";

vi.mock("html2canvas", () => ({
  default: () => Promise.resolve({ toDataURL: vi.fn(() => "foo") }),
}));

beforeEach(() => {
  document.body.innerHTML = `
    <div class="zoom__box"></div>
    <a class="zoom__save"></a>
    <label class="zoom__checkbox"><input type="checkbox" name="watermark" id="watermark"></label>
  `;
});

test("should create the appropriate DataUrl image", async () => {
  imageSaver();
  const save = document.querySelector(".zoom__save");

  save.click();

  await vi.waitFor(() => expect(save.href).toContain("foo"));
  expect(save.download).toBe("zoommeme");
});

test("should set the correct class to the box", () => {
  imageSaver();
  const save = document.querySelector(".zoom__save");
  const zoomBox = document.querySelector(".zoom__box");
  expect(zoomBox.classList).not.toContain("zoom__box--save");

  save.click();

  expect(zoomBox.classList).toContain("zoom__box--save");
});
