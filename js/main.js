// Wires up: starfield, the hero logo bands, the scroll-tied fade on
// each page's content, and shooting stars.

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

buildStars();
const placeholderContentEls = [...document.querySelectorAll(".placeholder-segment .content")];
const contentEls = [document.querySelector("#segment-hero .content"), ...placeholderContentEls];
observeContent(contentEls);
scheduleShootingStars();
