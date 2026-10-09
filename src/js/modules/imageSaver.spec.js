import imageSaver from "./imageSaver";

const html2canvas = vi.hoisted(() => vi.fn());
vi.mock("html2canvas", () => ({ default: html2canvas }));

beforeEach(() => {
  html2canvas.mockResolvedValue({ toDataURL: () => "foo" });
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

test("should restore the zoom controls after a successful export", async () => {
  imageSaver();
  const save = document.querySelector(".zoom__save");
  const zoomBox = document.querySelector(".zoom__box");

  save.click();

  await vi.waitFor(() =>
    expect(zoomBox.classList).not.toContain("zoom__box--save"),
  );
});

test("should restore the box and report when the export fails", async () => {
  html2canvas.mockRejectedValue(new Error("boom"));
  imageSaver();
  const save = document.querySelector(".zoom__save");
  const zoomBox = document.querySelector(".zoom__box");

  save.click();

  await vi.waitFor(() =>
    expect(save.textContent).toBe("Save failed, try again"),
  );
  expect(zoomBox.classList).not.toContain("zoom__box--save");
});
