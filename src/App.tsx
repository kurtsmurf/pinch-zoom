import { createSignal } from "solid-js";

const createPinchGesture = (onChange: (factor: number) => void) => {
  let distance = 0;

  function touchStartHandler(e: TouchEvent) {
    if (e.touches.length === 2) {
      const [touch1, touch2] = e.touches;
      distance = Math.abs(touch2.clientX - touch1.clientX);
    }
  }

  function touchMoveHandler(e: TouchEvent) {
    if (e.touches.length === 2) {
      const [touch1, touch2] = e.touches;
      const currentDistance = Math.abs(touch2.clientX - touch1.clientX);
      onChange(currentDistance / distance);
      distance = currentDistance;
    }
  }

  function touchEndHandler(e: TouchEvent) {
    distance = 0;
  }

  return { touchStartHandler, touchMoveHandler, touchEndHandler };
};

const App = () => {
  const [radius, setRadius] = createSignal(0.5);
  const pinch = createPinchGesture((factor) => {
    setRadius((prev) => Math.max(0.01, Math.min(1, prev * factor)));
  });

  return (
    <div
      id="target"
      ontouchstart={pinch.touchStartHandler}
      ontouchmove={pinch.touchMoveHandler}
      ontouchend={pinch.touchEndHandler}
    >
      <svg viewBox="0 0 2 2">
        <circle cx="1" cy="1" r={radius()} fill="black"></circle>
      </svg>
    </div>
  );
};

export default App;
