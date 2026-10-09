export default function createStore(initial) {
  let state = initial;
  const listeners = new Set();

  return {
    get: () => state,
    set(patch) {
      state = { ...state, ...patch };
      for (const listener of listeners) listener(state);
    },
    subscribe(listener) {
      listeners.add(listener);
    },
  };
}
