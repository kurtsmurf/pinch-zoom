import { createSignal } from "solid-js";

const createPinchZoom = (onZoom: (factor: number) => void) => {
  const pointers = [];
  let prevDiff = -1;

  function pointerdownHandler(ev: PointerEvent) {
    pointers.push(ev);
  }

  function pointermoveHandler(ev: PointerEvent) {
    // update pointers
    const index = pointers.findIndex(
      (cachedEv) => cachedEv.pointerId === ev.pointerId,
    );
    pointers[index] = ev;
    // If two pointers are down, check for pinch gestures
    if (pointers.length === 2) {
      // Calculate the distance between the two pointers
      const curDiff = Math.abs(pointers[0].clientX - pointers[1].clientX);
      if (prevDiff > 0) {
        onZoom(curDiff / prevDiff);
      }
      prevDiff = curDiff;
    }
  }

  function pointerupHandler(ev: PointerEvent) {
    const index = pointers.findIndex(
      (cachedEv) => cachedEv.pointerId === ev.pointerId,
    );
    pointers.splice(index, 1);
    if (pointers.length < 2) {
      prevDiff = -1;
    }
  }

  return { pointerdownHandler, pointermoveHandler, pointerupHandler };
};

const App = () => {
  const [radius, setRadius] = createSignal(0.5);
  const pinchZoom = createPinchZoom((factor) => {
    setRadius((prev) => Math.max(0.01, Math.min(1, prev * factor)));
  });

  return (
    <div
      id="target"
      onpointerdown={pinchZoom.pointerdownHandler}
      onpointermove={pinchZoom.pointermoveHandler}
      onpointerup={pinchZoom.pointerupHandler}
      onpointercancel={pinchZoom.pointerupHandler}
      onpointerout={pinchZoom.pointerupHandler}
      onpointerleave={pinchZoom.pointerupHandler}
    >
      <svg viewBox="0 0 2 2">
        <circle cx="1" cy="1" r={radius()} fill="black"></circle>
      </svg>
    </div>
  );
};

export default App;
