// Right-edge, whole-site page nav: 5 fixed stops, each pointing at one
// <section id="..."> already in the DOM. Same "single continuous position
// (rawIndex) driven off the real scroller.scrollTop" core as the Memory
// Lane timeline's own event stick (js/timeline.js); the shared mechanics
// (stop spacing, drag, click, per-frame loop) live in js/stick.js — drag and
// click both just move that real scrollTop, everything else re-renders
// every frame as a pure function of it. Two differences from the timeline stick:
// 1) sections here have very different heights, so rawIndex is computed by
//    interpolating between each section's actual offsetTop instead of a
//    uniform px-per-step — the fill between two stops therefore advances
//    at a rate matching how much of that section has actually scrolled by,
//    not a flat 1/4 per gap.
// 2) stops sit at fixed, evenly-spaced positions top-to-bottom (unlike the
//    timeline's fisheye, which recenters the selected event) — only
//    brightness/scale changes with proximity, not position.

const PAGES = [
  { id: "segment-hero", label: "Home" },
  { id: "segment-timeline", label: "Memory Lane" },
  { id: "segment-more-about-me", label: "More about Me" },
  { id: "segment-my-story", label: "My Story" },
  { id: "segment-credits", label: "Credits" }
];

function buildPageNav() {
  const scroller = document.getElementById("scroller");
  const wrap = document.getElementById("pageNav");
  const stick = document.getElementById("pageNavStick");
  const fill = document.getElementById("pageNavFill");
  if (!wrap || !stick) return;

  const sections = PAGES.map((p) => document.getElementById(p.id)).filter(Boolean);
  if (sections.length < 2) return;

  // Home/Credits sit a little in from the stick's actual ends (see
  // STICK_INSET_PCT in js/stick.js, shared with the timeline spine), leaving
  // a short bare, unlabeled tip of stick visible above/below them. Gaps are
  // equal, so uniform weights.
  const stopPercent = makeStopPercent(uniformWeights(PAGES.length));

  const itemEls = PAGES.map((p, i) => {
    const el = document.createElement("div");
    el.className = "pagenav-item";
    // fixed, evenly-spaced position — first stop just below the stick's
    // top tip, last just above its bottom tip, regardless of which one is
    // current
    el.style.top = `${stopPercent(i)}%`;
    const dot = document.createElement("span");
    dot.className = "pagenav-dot";
    const label = document.createElement("span");
    label.className = "pagenav-label";
    // one <span> per word — on desktop these sit inline as one line (CSS),
    // on narrow screens they stack one word per line instead of the
    // browser's own wrapping, so a 3-word label never breaks mid-word or
    // groups two words onto one line
    p.label.split(" ").forEach((word) => {
      const wordEl = document.createElement("span");
      wordEl.className = "pagenav-word";
      wordEl.textContent = word;
      label.appendChild(wordEl);
    });
    el.appendChild(label);
    el.appendChild(dot);
    stick.appendChild(el);
    return el;
  });

  // each section's scroll-snap "start" offset within the scroller — sections
  // snap exactly here, so this is the ground truth for "which page are we on"
  function sectionTops() {
    return sections.map((s) => s.offsetTop);
  }

  function scrollTopToRawIndex(scrollTop, tops) {
    for (let i = 0; i < tops.length - 1; i++) {
      if (scrollTop <= tops[i + 1] || i === tops.length - 2) {
        const span = tops[i + 1] - tops[i];
        const frac = span > 0 ? (scrollTop - tops[i]) / span : 0;
        return i + Math.max(0, Math.min(1, frac));
      }
    }
    return 0;
  }

  function rawIndexToScrollTop(index, tops) {
    const i = Math.max(0, Math.min(tops.length - 2, Math.floor(index)));
    const frac = index - i;
    return tops[i] + frac * (tops[i + 1] - tops[i]);
  }

  let rawIndex = 0;

  function render() {
    itemEls.forEach((el, i) => {
      const dist = i - rawIndex;
      const proximity = Math.max(0, 1 - Math.abs(dist));

      // position is fixed (set once, above) — only brightness/size react
      // to how close this stop is to the current scroll position
      const scale = 0.85 + 0.25 * proximity;
      el.style.transform = `translateY(-50%) scale(${scale})`;
      el.style.opacity = (0.4 + 0.6 * proximity).toFixed(2);
      el.classList.toggle("selected", proximity > 0.5);
    });

    // fill spans exactly Home's tip to Credits' tip (the same inset range
    // the stops sit in) — the bare stick tips above/below never fill
    if (fill) fill.style.height = `${stopPercent(rawIndex).toFixed(1)}%`;
    // Memory Lane's credits note (#timelineCreditsNote) is owned by
    // js/timeline.js instead — it needs to know which specific stop is
    // current (image-based vs text-based), not just which page
  }

  function updateFromScroll() {
    rawIndex = scrollTopToRawIndex(scroller.scrollTop, sectionTops());
    render();
  }

  everyFrame(updateFromScroll);

  // ---- dragging the stick and clicking a stop: shared mechanics, see
  // js/stick.js ----
  attachStickDrag({
    scroller,
    stickEl: stick,
    stopCount: itemEls.length,
    indexToScrollTop: (index) => rawIndexToScrollTop(index, sectionTops())
  });
  itemEls.forEach((el, i) => {
    attachStopClick({ scroller, el, getScrollTop: () => sectionTops()[i] });
  });
}

buildPageNav();
