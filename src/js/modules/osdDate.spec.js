import osdDate from "./osdDate";

test("formats dates like a camcorder display", () => {
  expect(osdDate(new Date(2026, 9, 9))).toBe("OCT 09 2026");
});
