import mockEvent from "./utils";

beforeEach(() => {
  vi.resetModules();

  document.body.innerHTML = `
    <div id="holder">
      <input type="text" />
    </div>
    <main class="landing"></main>
    <p class="error" hidden></p>
  `;
});

describe("file input", () => {
  test("read files and filter images", async () => {
    const mockInput = mockEvent("input", "onchange");
    const imageLoader = (await import("./imageLoader")).default;

    mockInput.cb({ target: { files: [{ type: "image/png" }] } });

    expect(await imageLoader).toBeTruthy();
  });

  test("shows an error if not images, then accepts a retry", async () => {
    const mockInput = mockEvent("input", "onchange");
    const imageLoader = (await import("./imageLoader")).default;
    const error = document.querySelector(".error");

    mockInput.cb({ target: { files: [{ type: "text" }] } });

    expect(error.hidden).toBe(false);
    expect(error.textContent).toContain("isn't supported");

    mockInput.cb({ target: { files: [{ type: "image/png" }] } });

    expect(await imageLoader).toBeTruthy();
    expect(error.hidden).toBe(true);
  });
});

test("rejects svg images", async () => {
  const mockInput = mockEvent("input", "onchange");
  await import("./imageLoader");

  mockInput.cb({ target: { files: [{ type: "image/svg+xml" }] } });

  expect(document.querySelector(".error").hidden).toBe(false);
});

describe("file drop", () => {
  test("read files and filter images", async () => {
    const mockDrop = mockEvent("#holder", "ondrop");
    const imageLoader = (await import("./imageLoader")).default;

    mockDrop.cb({
      preventDefault: () => {},
      dataTransfer: { files: [{ type: "image/png" }] },
    });

    expect(await imageLoader).toBeTruthy();
  });

  test("shows an error if not images", async () => {
    const mockDrop = mockEvent("#holder", "ondrop");
    await import("./imageLoader");

    mockDrop.cb({
      preventDefault: () => {},
      dataTransfer: { files: [{ type: "text" }] },
    });

    expect(document.querySelector(".error").hidden).toBe(false);
  });
});

test("disable holder dragover and dragend", async () => {
  await import("./imageLoader");

  const holder = document.querySelector("#holder");
  expect(holder.ondragover()).toBeFalsy();
  expect(holder.ondragend()).toBeFalsy();
});
