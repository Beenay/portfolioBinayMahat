// A single shared lightbox used by the timeline photo galleries
// (js/timeline.js calls openLightbox(images, startIndex)). Covers most of
// the screen with the background dimmed behind it, shows the real photo
// with curved edges, its caption below, and prev/next arrows either side —
// same arrangement on mobile and desktop for now.

let lightboxImages = [];
let lightboxIndex = 0;

function buildLightbox() {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.hidden = true;

  const inner = document.createElement("div");
  inner.className = "lightbox-inner";

  const closeBtn = document.createElement("button");
  closeBtn.className = "lightbox-close";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.innerHTML = "&#10005;";

  const stage = document.createElement("div");
  stage.className = "lightbox-stage";

  const prevBtn = makeArrowButton({
    className: "lightbox-arrow prev",
    label: "Previous image",
    glyph: "&#8249;",
    onClick: () => show(lightboxIndex - 1)
  });

  const frame = document.createElement("div");
  frame.className = "lightbox-frame";
  const photo = document.createElement("img");
  photo.className = "lightbox-photo";
  photo.loading = "eager";
  frame.appendChild(photo);

  const nextBtn = makeArrowButton({
    className: "lightbox-arrow next",
    label: "Next image",
    glyph: "&#8250;",
    onClick: () => show(lightboxIndex + 1)
  });

  stage.appendChild(prevBtn);
  stage.appendChild(frame);
  stage.appendChild(nextBtn);

  const caption = document.createElement("p");
  caption.className = "lightbox-caption";

  inner.appendChild(closeBtn);
  inner.appendChild(stage);
  inner.appendChild(caption);
  overlay.appendChild(inner);
  document.body.appendChild(overlay);

  function render() {
    const img = lightboxImages[lightboxIndex];
    if (img.image) {
      photo.src = img.image;
      photo.alt = img.caption || img.label || "";
      photo.style.display = "block";
      frame.style.background = "";
      frame.classList.remove("placeholder");
    } else {
      photo.removeAttribute("src");
      photo.style.display = "none";
      frame.style.background = img.color;
      frame.classList.add("placeholder");
    }
    caption.textContent = img.caption || "";
  }

  function show(index) {
    lightboxIndex = (index + lightboxImages.length) % lightboxImages.length;
    render();
  }

  function close() {
    overlay.hidden = true;
  }

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close(); // click on the dimmed backdrop closes it
  });
  document.addEventListener("keydown", (e) => {
    if (overlay.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(lightboxIndex - 1);
    else if (e.key === "ArrowRight") show(lightboxIndex + 1);
  });

  return {
    open(images, startIndex) {
      lightboxImages = images;
      show(startIndex);
      overlay.hidden = false;
    }
  };
}

const lightboxInstance = buildLightbox();

function openLightbox(images, startIndex) {
  lightboxInstance.open(images, startIndex);
}
