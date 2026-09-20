// The shared "stick" mechanics behind both the Memory Lane spine
// (js/timeline.js) and the right-edge page nav (js/pagenav.js). Each is a
// thin vertical bar with stops on it; the page's real scrollTop is the only
// state, and both bars share the same four jobs:
//   1. where a stop sits along the bar        -> makeStopPercent
//   2. dragging the bar scrolls the page      -> attachStickDrag
//   3. clicking a stop jumps to it            -> attachStopClick
//   4. re-render every frame from scrollTop   -> everyFrame
// What differs (how spacing is weighted, how scrollTop maps to a position,
// what each stop looks like) stays in each file and is passed in here.

// how far in from the bar's ends the first/last stop sit, leaving a short
// bare tip of bar visible above/below — one value for both bars, so their
// stops line up
const STICK_INSET_PCT = 6;

// cumulativeWeight[i] = distance from stop 0 to stop i, in any unit. Equal
// gaps -> uniformWeights(count); unequal gaps -> build your own array (the
// timeline shrinks gaps beside text-only stops). The result maps a
// (possibly fractional) stop index to a % position down the bar, always
// spanning exactly STICK_INSET_PCT..(100 - STICK_INSET_PCT).
function makeStopPercent(cumulativeWeight) {
  const last = cumulativeWeight.length - 1;
  const total = cumulativeWeight[last];
  const usable = 100 - STICK_INSET_PCT * 2;
  return function stopPercent(i) {
    const floor = Math.max(0, Math.min(last, Math.floor(i)));
    const ceil = Math.min(last, floor + 1);
    const frac = i - floor;
    const weight = cumulativeWeight[floor] + (cumulativeWeight[ceil] - cumulativeWeight[floor]) * frac;
    return STICK_INSET_PCT + (weight / total) * usable;
  };
}

function uniformWeights(count) {
  return Array.from({ length: count }, (_, i) => i);
}

// Dragging the bar scrolls the real page 1:1. indexToScrollTop turns a
// (fractional) stop index into the scrollTop that produces it. CSS
// scroll-behavior:smooth would re-smooth every per-move write on top of
// each other and make the drag feel laggy, so it's switched off just for
// the duration of the drag.
function attachStickDrag({ scroller, stickEl, stopCount, indexToScrollTop }) {
  let dragging = false;
  let behaviorBeforeDrag = "";

  function scrollToPointer(clientY) {
    const rect = stickEl.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    scroller.scrollTop = indexToScrollTop(fraction * (stopCount - 1));
  }

  stickEl.addEventListener("pointerdown", (e) => {
    dragging = true;
    stickEl.setPointerCapture(e.pointerId);
    behaviorBeforeDrag = scroller.style.scrollBehavior;
    scroller.style.scrollBehavior = "auto";
    scrollToPointer(e.clientY);
  });

  stickEl.addEventListener("pointermove", (e) => {
    if (dragging) scrollToPointer(e.clientY);
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    scroller.style.scrollBehavior = behaviorBeforeDrag;
  }
  stickEl.addEventListener("pointerup", endDrag);
  stickEl.addEventListener("pointercancel", endDrag);
}

// Clicking a stop smooth-scrolls to it. Its pointerdown is stopped so it
// doesn't also start a bar drag underneath it.
function attachStopClick({ scroller, el, getScrollTop }) {
  el.addEventListener("pointerdown", (e) => e.stopPropagation());
  el.addEventListener("click", () => {
    scroller.scrollTo({ top: getScrollTop(), behavior: "smooth" });
  });
}

// Re-render every frame (not just on 'scroll' events), so visuals stay a
// pure function of the current scrollTop even mid scroll-snap settle.
function everyFrame(fn) {
  function tick() {
    fn();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
