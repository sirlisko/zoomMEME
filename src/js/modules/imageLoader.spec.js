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
  document
    .querySelector(".landing__intro")
    .dispatchEvent(new Event("dragenter", { bubbles: true }));
  document.dispatchEvent(event);
  return event;
}

let callback;

beforeEach(() => {
  document.body.innerHTML = `
    <main id="holder">
      <div class="landing__intro"><input type="file" /></div>
    </main>
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

test("highlights the page while a file is dragged over it", () => {
  const intro = document.querySelector(".landing__intro");

  intro.dispatchEvent(new Event("dragenter", { bubbles: true }));

  expect(document.body.classList).toContain("is-dragging");

  intro.dispatchEvent(new Event("dragleave", { bubbles: true }));

  expect(document.body.classList).not.toContain("is-dragging");
});

test("clears the highlight on drop", () => {
  drop([png]);

  expect(document.body.classList).not.toContain("is-dragging");
});

test("accepts a pasted image", () => {
  const event = new Event("paste");
  event.clipboardData = { files: [png] };

  document.dispatchEvent(event);

  expect(callback).toHaveBeenCalledWith(png);
});

test("ignores pastes without files", () => {
  const event = new Event("paste");
  event.clipboardData = { files: [] };

  document.dispatchEvent(event);

  expect(callback).not.toHaveBeenCalled();
  expect(document.querySelector(".error").hidden).toBe(true);
});
