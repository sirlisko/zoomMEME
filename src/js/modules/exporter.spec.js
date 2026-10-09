import { downloadJpg } from "./exporter";

test("downloads the canvas as a JPEG", async () => {
  const blob = new Blob(["x"]);
  const canvas = { toBlob: vi.fn((cb) => cb(blob)) };
  URL.createObjectURL = vi.fn(() => "blob:meme");
  URL.revokeObjectURL = vi.fn();
  let link;
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(function () {
      link = this;
    });

  await downloadJpg(canvas);

  expect(canvas.toBlob).toHaveBeenCalledWith(
    expect.any(Function),
    "image/jpeg",
    0.92,
  );
  expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
  expect(link.download).toBe("zoommeme.jpg");
  click.mockRestore();
});

test("fails when the canvas cannot be encoded", async () => {
  const canvas = { toBlob: (cb) => cb(null) };

  await expect(downloadJpg(canvas)).rejects.toThrow("Export failed.");
});
