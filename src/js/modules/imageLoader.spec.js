import onImage from "./imageLoader";

const png = { type: "image/png" };

function choose(files) {
  const input = document.querySelector("input");
  Object.defineProperty(input, "files", { value: files, configurable: true });
  input.dispatchEvent(new Event("change"));
}

function drop(files) {
  const event = new Event("drop", { cancelable: true });
  event.dataTransfer = { files };
  document.getElementById("holder").dispatchEvent(event);
  return event;
}

let callback;

beforeEach(() => {
  document.body.innerHTML = `
    <main id="holder"><input type="file" /></main>
    <p class="error" hidden></p>
  `;
  callback = vi.fn();
  onImage(callback);
});

test("passes on a chosen image", () => {
  choose([png]);

  expect(callback).toHaveBeenCalledWith(png);
});

test("passes on a dropped image", () => {
  const event = drop([{ type: "text/plain" }, png]);

  expect(callback).toHaveBeenCalledWith(png);
  expect(event.defaultPrevented).toBe(true);
});

test("shows an error for unsupported files, then accepts a retry", () => {
  const error = document.querySelector(".error");

  choose([{ type: "image/svg+xml" }]);

  expect(callback).not.toHaveBeenCalled();
  expect(error.hidden).toBe(false);
  expect(error.textContent).toContain("isn't supported");

  choose([png]);

  expect(callback).toHaveBeenCalledWith(png);
  expect(error.hidden).toBe(true);
});

test("accepts more than one photo over time", () => {
  choose([png]);
  drop([png]);

  expect(callback).toHaveBeenCalledTimes(2);
});
