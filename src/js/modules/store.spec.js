import createStore from "./store";

test("merges updates and notifies subscribers", () => {
  const store = createStore({ a: 1, b: 2 });
  const listener = vi.fn();
  store.subscribe(listener);

  store.set({ b: 3 });

  expect(store.get()).toEqual({ a: 1, b: 3 });
  expect(listener).toHaveBeenCalledWith({ a: 1, b: 3 });
});
