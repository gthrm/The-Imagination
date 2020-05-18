/* eslint-disable no-undef */
export default function disableLongPress() {
  return {
    onTouchMove: () => {},
    onTouchCancel: () => {},
    onTouchStart: () => {},
    onTouchEnd: () => {},
  };
}
