import showDemo from "./demo";
import demoPhotos from "./demoPhotos";

beforeEach(() => {
  document.body.innerHTML = `
    <figure class="demo">
      <img class="demo__photo" />
      <span class="osd__date"></span>
      <figcaption class="demo__credit"><a></a></figcaption>
    </figure>
  `;
});

test("shows a demo photo zooming towards its focus point", () => {
  showDemo(() => 0);

  const img = document.querySelector(".demo__photo");
  expect(img.getAttribute("src")).toBe(demoPhotos[0].src);
  expect(img.style.transformOrigin).toBe("61.5% 42.7%");
});

test("credits the photo's source", () => {
  showDemo(() => 0.99);

  const credit = document.querySelector(".demo__credit a");
  expect(credit.href).toBe(demoPhotos.at(-1).source);
  expect(credit.textContent).toContain("Wikimedia Commons");
});

test("stamps today's date on the display", () => {
  showDemo(() => 0);

  expect(document.querySelector(".osd__date").textContent).toMatch(
    /^[A-Z]{3} \d{2} \d{4}$/,
  );
});
