import { createSignal } from "solid-js";

type Pinch = { touch1: Touch; touch2: Touch };

const createPinch = (
  onChange: (
    props: { initial: Pinch; previous: Pinch; current: Pinch },
  ) => void,
) => {
  let initial: Pinch | undefined;
  let previous: Pinch | undefined;

  function touchStartHandler(e: TouchEvent) {
    if (e.touches.length === 2) {
      const [touch1, touch2] = e.touches;
      previous = initial = { touch1, touch2 };
    }
  }

  function touchMoveHandler(e: TouchEvent) {
    if (e.touches.length === 2) {
      const [touch1, touch2] = e.touches;
      const current = { touch1, touch2 };
      onChange({ current, initial, previous });
      previous = current;
    }
  }

  function touchEndHandler(e: TouchEvent) {
    previous = initial = undefined;
  }

  return { touchStartHandler, touchMoveHandler, touchEndHandler };
};

const App = () => {
  const [radius, setRadius] = createSignal(0.5);
  const pinch = createPinch(({ current, previous }) => {
    const currentDistance = Math.abs(
      current.touch1.clientX - current.touch2.clientX,
    );
    const previousDistance = Math.abs(
      previous.touch1.clientX - previous.touch2.clientX,
    );
    const factor = currentDistance / previousDistance;
    setRadius((prev) => Math.max(0.01, Math.min(1, prev * factor)));
  });

  return (
    <div id="container">
      <div class="not-target"></div>
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
      <div class="not-target"></div>
    </div>
  );
};

export default App;
