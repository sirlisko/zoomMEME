import createGifCache from "./gifCache";

vi.mock("./gif", () => ({
  SPEEDS: { normal: 600 },
  encodeGif: () => new Blob(["gif"], { type: "image/gif" }),
}));

const meme = (zoom = 1) => ({
  image: { src: "photo" },
  frames: [{ zoom }],
  options: {},
  speed: "normal",
});

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("encodes once the controls settle", () => {
  const cache = createGifCache();
  cache.prepare(meme());

  expect(cache.get(meme())).toBeNull();
  vi.runAllTimers();
  expect(cache.get(meme()).name).toBe("zoommeme.gif");
});

test("an unchanged meme does not cancel the pending encode", () => {
  const cache = createGifCache();
  cache.prepare(meme());
  cache.prepare(meme());
  vi.runAllTimers();

  expect(cache.get(meme())).not.toBeNull();
});

test("a changed meme invalidates the cached file", () => {
  const cache = createGifCache();
  cache.prepare(meme(1));
  vi.runAllTimers();
  cache.prepare(meme(2));

  expect(cache.get(meme(1))).toBeNull();
  expect(cache.get(meme(2))).toBeNull();
});
