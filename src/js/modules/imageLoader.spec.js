import mockEvent from "./utils";

beforeEach(() => {
  vi.resetModules();

  document.body.innerHTML = `
    <div id="holder">
      <input type="text" />
    </div>
    <div class="dropper"></div>
  `;
});

describe("file input", () => {
  test("read files and filter images", async () => {
    const mockInput = mockEvent("input", "onchange");
    const imageLoader = (await import("./imageLoader")).default;

    mockInput.cb({ target: { files: [{ type: "image/png" }] } });

    expect(await imageLoader).toBeTruthy();
  });

  test("read files and rise an error if not images", async () => {
    const mockInput = mockEvent("input", "onchange");
    const imageLoader = (await import("./imageLoader")).default;

    mockInput.cb({ target: { files: [{ type: "text" }] } });

    await expect(imageLoader).rejects.toThrow("Format not supported.");
  });
});

test("rejects svg images", async () => {
  const mockInput = mockEvent("input", "onchange");
  const imageLoader = (await import("./imageLoader")).default;

  mockInput.cb({ target: { files: [{ type: "image/svg+xml" }] } });

  await expect(imageLoader).rejects.toThrow("Format not supported.");
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

  test("read files and rise an error if not images", async () => {
    const mockDrop = mockEvent("#holder", "ondrop");
    const imageLoader = (await import("./imageLoader")).default;

    mockDrop.cb({
      preventDefault: () => {},
      dataTransfer: { files: [{ type: "text" }] },
    });

    await expect(imageLoader).rejects.toThrow("Format not supported.");
  });
});

test("disable holder dragover and dragend", async () => {
  await import("./imageLoader");

  const holder = document.querySelector("#holder");
  expect(holder.ondragover()).toBeFalsy();
  expect(holder.ondragend()).toBeFalsy();
});
