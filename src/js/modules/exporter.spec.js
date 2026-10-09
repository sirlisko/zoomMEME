import { canShare, download, jpegFile } from "./exporter";

afterEach(() => {
  vi.restoreAllMocks();
  delete navigator.canShare;
});

test("encodes the canvas as a JPEG file", async () => {
  const canvas = { toBlob: vi.fn((cb) => cb(new Blob(["x"]))) };

  const file = await jpegFile(canvas);

  expect(canvas.toBlob).toHaveBeenCalledWith(
    expect.any(Function),
    "image/jpeg",
    0.92,
  );
  expect(file.name).toBe("zoommeme.jpg");
  expect(file.type).toBe("image/jpeg");
});

test("fails when the canvas cannot be encoded", async () => {
  const canvas = { toBlob: (cb) => cb(null) };

  await expect(jpegFile(canvas)).rejects.toThrow("Export failed.");
});

test("downloads a file under its own name", () => {
  URL.createObjectURL = vi.fn(() => "blob:meme");
  URL.revokeObjectURL = vi.fn();
  let link;
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
    function () {
      link = this;
    },
  );

  download(new File(["x"], "zoommeme.gif"));

  expect(link.href).toBe("blob:meme");
  expect(link.download).toBe("zoommeme.gif");
});

test("offers sharing only when the browser can share files", () => {
  expect(canShare()).toBe(false);

  navigator.canShare = () => true;

  expect(canShare()).toBe(true);
});
