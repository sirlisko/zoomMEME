const eventsMap = {
  desktop: { start: "mousedown", move: "mousemove", end: "mouseup" },
  mobile: { start: "touchstart", move: "touchmove", end: "touchend" },
};

function eventsPerDevice() {
  return typeof window.orientation !== "undefined"
    ? eventsMap.mobile
    : eventsMap.desktop;
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
    target.style.marginLeft = `${(e.pageX || e.touches[0].pageX) - diffX}px`;
    target.style.marginTop = `${(e.pageY || e.touches[0].pageY) - diffY}px`;
  };
}

function imagePosition() {
  const events = eventsPerDevice();
  const img = document.querySelector(".zoom__box");
  img.addEventListener(events.start, (e) => {
    if (e.target.nodeName !== "IMG") return;
    e.preventDefault();

    const moveImage = moveImg(e);

    document.addEventListener(events.end, () =>
      document.removeEventListener(events.move, moveImage),
    );
    document.addEventListener(events.move, moveImage);
  });
}

export default imagePosition;
