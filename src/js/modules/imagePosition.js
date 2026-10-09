import isTouchDevice from "./device";

const eventsMap = {
  desktop: { start: "mousedown", move: "mousemove", end: "mouseup" },
  mobile: { start: "touchstart", move: "touchmove", end: "touchend" },
};

function eventsPerDevice() {
  return isTouchDevice() ? eventsMap.mobile : eventsMap.desktop;
}

const MIN_VISIBLE = 50;

function clamp(value, size, frameSize) {
  const min = MIN_VISIBLE - size;
  const max = frameSize - MIN_VISIBLE;
  return Math.min(Math.max(value, min), max);
}

function moveImg(evt) {
  const target = evt.target;
  const diffX =
    (evt.pageX || evt.touches[0].pageX) -
    parseInt(target.style.marginLeft || 0, 10);
  const diffY =
    (evt.pageY || evt.touches[0].pageY) -
    parseInt(target.style.marginTop || 0, 10);

  return (e) => {
    e.preventDefault();
    const { offsetWidth, offsetHeight, parentElement: frame } = target;
    const x = (e.pageX || e.touches[0].pageX) - diffX;
    const y = (e.pageY || e.touches[0].pageY) - diffY;
    target.style.marginLeft = `${clamp(x, offsetWidth, frame.offsetWidth)}px`;
    target.style.marginTop = `${clamp(y, offsetHeight, frame.offsetHeight)}px`;
  };
}

function imagePosition() {
  const events = eventsPerDevice();
  const img = document.querySelector(".zoom__box");
  img.addEventListener(events.start, (e) => {
    if (e.target.nodeName !== "IMG") return;
    e.preventDefault();

    const moveImage = moveImg(e);

    document.addEventListener(
      events.end,
      () => document.removeEventListener(events.move, moveImage),
      { once: true },
    );
    document.addEventListener(events.move, moveImage);
  });
}

export default imagePosition;
