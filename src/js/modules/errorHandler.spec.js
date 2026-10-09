import errorHandler from "./errorHandler";

beforeEach(() => {
  document.body.innerHTML = '<p class="error" hidden></p>';
});

test("errorHandler shows the message", () => {
  errorHandler(new Error("foo"));

  const error = document.querySelector(".error");
  expect(error.textContent).toBe("foo");
  expect(error.hidden).toBe(false);
});
