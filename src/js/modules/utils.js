export default function (selector, event) {
  const mock = {
    selector,
    event,
  };

  const sel =
    selector === document ? document : document.querySelector(selector);

  sel.addEventListener = (_evt, cb) => {
    mock.cb = cb;
  };

  return mock;
}
