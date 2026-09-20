// Wires up: starfield, the hero logo bands, the scroll-tied fade on
// each page's content, the (optionally shown) background ship, and shooting stars.

const scroller = document.getElementById("scroller");

// ---- starfield (sparse, dim — the background should read as very dark
// with only a few stars, not a dense field) ----
function buildStars(count = 45) {
  const host = document.getElementById("stars");
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDuration = `${2 + Math.random() * 4}s`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    frag.appendChild(star);
  }
  host.appendChild(frag);
}

buildMarquee(document.getElementById("productsMarquee"), PRODUCTS, document.getElementById("productsArrowSlot"));
buildMarquee(document.getElementById("awardsMarquee"), AWARDS, document.getElementById("awardsArrowSlot"));

document.getElementById("timelineCreditsNote").textContent = TIMELINE_CREDITS_NOTE;

// ---- fade content in/out as its segment crosses the viewport ----
function buildThresholds(steps = 20) {
  return Array.from({ length: steps + 1 }, (_, i) => i / steps);
}

function observeContent(contentEls) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.style.opacity = Math.max(0, Math.min(1, entry.intersectionRatio)).toFixed(2);
      });
    },
    { root: scroller, threshold: buildThresholds() }
  );
  contentEls.forEach((el) => observer.observe(el));
}

// ---- ship: laps the four edges of the screen, one edge ("leg") per scroll
// transition, only moving while scrolling — it's a pure function of
// scrollTop, so reversing the scroll reverses the ship exactly. Order:
// start bottom-right -> up the right edge -> left along the top -> down the
// left edge -> right along the bottom -> back to start, then repeats. Each
// leg gets a small extra "launch mode" flame kick at its midpoint, and the
// ship fades out/in right at the start/end corner each lap. ----
const shipWrap = document.querySelector(".ship-wrap");
// tight corner hug (~4% gap from the edge) rather than sitting toward the
// middle — these are the ship-wrap's own top-left offsets, and since the
// ship's rendered size already scales with viewport width (see .ship-wrap's
// clamp() in css/style.css) this stays a snug ~4% gap at any screen size
const SHIP_LEFT_PCT = 3;
const SHIP_RIGHT_PCT = 85;
const SHIP_TOP_PCT = 4;
const SHIP_BOTTOM_PCT = 87;

// corners in travel order: bottom-right -> top-right -> top-left -> bottom-left
const CORNERS = [
  { left: SHIP_RIGHT_PCT, top: SHIP_BOTTOM_PCT }, // 0: bottom-right (start/reset)
  { left: SHIP_RIGHT_PCT, top: SHIP_TOP_PCT },    // 1: top-right
  { left: SHIP_LEFT_PCT, top: SHIP_TOP_PCT },     // 2: top-left
  { left: SHIP_LEFT_PCT, top: SHIP_BOTTOM_PCT }   // 3: bottom-left
];

function lerp(a, b, t) { return a + (b - a) * t; }

// the ship's default artwork noses right (0deg); these are the rotations
// that make it nose in each leg's forward direction of travel
const FORWARD_ANGLE = [-90, 180, 90, 0]; // leg0 up, leg1 left, leg2 down, leg3 right

let wasPastMidpoint = false;
let lastTotalProgress = 0;

function updateShipPosition() {
  // clamped: a scrollTop briefly below 0 (overscroll bounce), or a viewport
  // height of 0 while the page is still laying out, would otherwise give a
  // negative/NaN leg index and read past the end of CORNERS
  const totalProgress = Math.max(0, scroller.scrollTop / Math.max(1, window.innerHeight));
  const legIndex = Math.floor(totalProgress) % 4;
  const frac = totalProgress - Math.floor(totalProgress);

  const from = CORNERS[legIndex];
  const to = CORNERS[(legIndex + 1) % 4];
  shipWrap.style.left = `${lerp(from.left, to.left, frac)}%`;
  shipWrap.style.top = `${lerp(from.top, to.top, frac)}%`;

  // face the direction actually being traveled: forward through a leg noses
  // the leg's normal direction, scrolling backward flips it 180° so it's
  // always pointed where it's really headed. At rest (frac exactly on a
  // corner) this naturally resolves to "facing the next leg", i.e. the ship
  // always looks like it's poised to go wherever it's headed next.
  const movingBackward = totalProgress < lastTotalProgress;
  lastTotalProgress = totalProgress;
  const rotation = FORWARD_ANGLE[legIndex] + (movingBackward ? 180 : 0);
  shipWrap.style.transform = `rotate(${rotation}deg)`;

  // fade out approaching the reset corner (end of leg 3), fade back in
  // leaving it (start of leg 0) — "comes back and disappears". The very
  // first leg-0 (page load, before any lap has completed) stays fully
  // visible — only a real *return* to the corner triggers the fade-in.
  const lapCount = Math.floor(totalProgress / 4);
  let opacity = 1;
  if (legIndex === 3) opacity = 1 - Math.max(0, Math.min(1, (frac - 0.8) / 0.2));
  if (legIndex === 0 && lapCount > 0) opacity = Math.max(0, Math.min(1, frac / 0.15));
  shipWrap.style.opacity = opacity.toFixed(2);

  // booster: on for the entire travel between corners, off only once
  // actually parked exactly at one — driven by position, not by whether a
  // 'scroll' event fired recently, so it can't flicker off mid-transition
  // during a scroll-snap settle animation that pauses between events.
  const isMoving = frac > 0.001;
  document.body.classList.toggle("boosting", isMoving);

  // first real ship movement auto-starts the background music (js/music.js);
  // it no-ops after the first time, and never fights a manual pause
  if (isMoving && window.notifyShipMoved) window.notifyShipMoved();

  // extra flame kick exactly at each leg's midpoint, in either scroll direction
  const pastMidpoint = frac >= 0.5;
  if (pastMidpoint !== wasPastMidpoint) {
    document.body.classList.add("boosting-surge");
    setTimeout(() => document.body.classList.remove("boosting-surge"), 260);
  }
  wasPastMidpoint = pastMidpoint;
}

// ---- keep the ship glued to scroll position every frame, not just when a
// 'scroll' event happens to fire — this is what lets the booster state be a
// direct read of "are we exactly parked at a corner right now" instead of a
// timeout guess, so it can't flicker during a scroll-snap settle animation ----
function startShipLoop() {
  function tick() {
    updateShipPosition();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ---- shooting stars: an occasional streak crossing the background, on a
// random interval so it doesn't feel mechanical ----
function spawnShootingStar() {
  const host = document.getElementById("stars");
  const star = document.createElement("div");
  star.className = "shooting-star";
  star.style.top = `${Math.random() * 40}%`;
  star.style.left = `${20 + Math.random() * 60}%`;
  star.style.setProperty("--tilt", `${25 + Math.random() * 10}deg`); // shallow streak, slight natural variance
  star.addEventListener("animationend", () => star.remove());
  host.appendChild(star);
}

function scheduleShootingStars() {
  const delay = 3000 + Math.random() * 6000;
  setTimeout(() => {
    spawnShootingStar();
    scheduleShootingStars();
  }, delay);
}

// ---- showShip button: the ship is hidden by default (CSS); this toggles it ----
const shipToggle = document.getElementById("shipToggle");
shipToggle.addEventListener("click", () => {
  const shown = document.body.classList.toggle("show-ship");
  shipToggle.textContent = shown ? "hideShip" : "showShip";
});

buildStars();
const placeholderContentEls = [...document.querySelectorAll(".placeholder-segment .content")];
const contentEls = [document.querySelector("#segment-hero .content"), ...placeholderContentEls];
observeContent(contentEls);
startShipLoop();
scheduleShootingStars();
