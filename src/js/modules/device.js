export default function isTouchDevice() {
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
