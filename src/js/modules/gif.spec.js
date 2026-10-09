import { encodeGif, frameDelay } from "./gif";

const writeFrame = vi.fn();
vi.mock("gifenc", () => ({
  GIFEncoder: () => ({
    writeFrame,
    finish: vi.fn(),
    bytes: () => new Uint8Array([1, 2, 3]),
  }),
  quantize: () => "palette",
  applyPalette: () => "index",
}));

const ctx = {
  drawImage: vi.fn(),
  getImageData: () => ({ data: new Uint8ClampedArray(4) }),
};

beforeEach(() => {
  writeFrame.mockClear();
  vi.spyOn(document, "createElement").mockReturnValue({
    getContext: () => ctx,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test("holds the last frame twice as long", () => {
  expect(frameDelay(0, 4, 600)).toBe(600);
  expect(frameDelay(3, 4, 600)).toBe(1200);
});

test("writes one GIF frame per zoom frame", async () => {
  const frame = { zoom: 1, sx: 0, sy: 0, sw: 10, sh: 5 };

  const blob = encodeGif({}, [frame, frame, frame], {}, 500);

  expect(writeFrame).toHaveBeenCalledTimes(3);
  expect(writeFrame).toHaveBeenLastCalledWith("index", 800, 400, {
    palette: "palette",
    delay: 1000,
  });
  expect(blob.type).toBe("image/gif");
});
