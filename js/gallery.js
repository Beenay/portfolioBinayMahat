// A gallery card for one event's whole "segment" of photos (js/data.js's
// `images` array — any length, not just 2). Desktop shows every photo at
// once in a 2-column grid with alternating caption/photo order for a
// zigzag look; mobile turns it into a horizontally draggable strip with a
// "scroll for more" arrow — the exact same mechanic (and .marquee-arrow
// styling) as the hero page's logo marquees in js/marquee.js. Each
// caption is capped to a fixed few lines; a caption that overflows shows
// the rest in the shared hover/click tooltip (js/hovertooltip.js).
// Clicking a photo opens it full-size in the site's existing lightbox
// (js/lightbox.js).
let galleryTooltipAutoCloseWired = false;
// shared across every gallery card so click handlers only need one check
// for "is this the narrow/mobile layout" instead of re-deriving it
const galleryMobileQuery = window.matchMedia("(max-width: 820px)");
function buildGalleryCard(images, label) {
  const card = document.createElement("div");
  card.className = "timeline-card timeline-gallery-card";

  const track = document.createElement("div");
  track.className = "timeline-gallery-track";

  const lightboxImages = images.map((im) => ({ image: im.src, caption: im.caption }));
  let trackDragMoved = false;

  // desktop paging: with more than 2 photos, one column-pair (a "slide")
  // shows at a time instead of every photo stacking into extra grid rows
  // — same photo/caption/"Open Image" combo as a 2-photo gallery, just
  // paged through with the arrows instead of all being visible at once.
  // Mobile ignores this entirely and keeps scrolling item-by-item, same
  // as before — see isMobile()/updateDesktopSlide() below.
  const slideCount = Math.ceil(images.length / 2);
  const isPaged = slideCount > 1;
  card.classList.toggle("has-paged-arrows", isPaged);
  let currentSlide = 0;
  function isMobile() {
    return galleryMobileQuery.matches;
  }

  const itemEls = [];
  images.forEach((im, i) => {
    const item = document.createElement("div");
    item.className = "timeline-gallery-item";
    itemEls.push(item);
    // alternate columns read caption-above-photo instead of photo-above-
    // caption, for the zigzag; mobile CSS undoes this and keeps every
    // item in the same order for a consistent scroll
    item.classList.toggle("timeline-gallery-item-alt", i % 2 === 1);

    // "Open Image" is its own row above the photo, not an overlay on it —
    // grouped with the frame so the zigzag's caption/photo order-swap
    // (below) always keeps this label directly above its own image
    const photoBlock = document.createElement("div");
    photoBlock.className = "timeline-gallery-photo";

    // simple text call-to-action hinting the photo opens full-size
    const openLabel = document.createElement("span");
    openLabel.className = "timeline-gallery-open-label";
    openLabel.textContent = "Open Image";
    photoBlock.appendChild(openLabel);

    const frame = document.createElement("div");
    frame.className = "timeline-gallery-frame";
    frame.dataset.imageIndex = String(i);
    const img = document.createElement("img");
    img.src = im.src;
    img.alt = im.caption || label;
    // lazy: most slides are hidden until paged to, so don't download them
    // (or the photos of far-off events) up front. w/h (tools/image-sizes.py)
    // let the browser reserve the right space before the file arrives.
    img.loading = "lazy";
    img.decoding = "async";
    if (im.w && im.h) { img.width = im.w; img.height = im.h; }
    frame.appendChild(img);
    photoBlock.appendChild(frame);

    const caption = document.createElement("p");
    caption.className = "timeline-gallery-caption";
    caption.textContent = im.caption || "";

    item.appendChild(photoBlock);
    item.appendChild(caption);
    track.appendChild(item);

    if (im.caption) {
      // on the caption itself only — hovering the photo shouldn't trigger it
      caption.addEventListener("mouseenter", () => {
        if (caption.scrollHeight > caption.clientHeight + 1) {
          showHoverTooltip(caption, im.caption);
        }
      });
      caption.addEventListener("mouseleave", hideHoverTooltip);
      // click support for touch devices, which don't really have "hover"
      caption.addEventListener("click", (e) => {
        if (caption.scrollHeight > caption.clientHeight + 1) {
          e.stopPropagation();
          showHoverTooltip(caption, im.caption);
        }
      });
    }
  });

  card.appendChild(track);

  if (!galleryTooltipAutoCloseWired) {
    galleryTooltipAutoCloseWired = true;
    document.addEventListener("click", hideHoverTooltip);
  }

  // prev/next arrows — mobile-only (CSS hides both on desktop, where
  // every photo is already visible). Direction-aware: only "next" shows
  // at the very start, only "prev" shows at the very end, both show in
  // between — no arrow ever points somewhere there's nothing to scroll to.
  // which slide (pair of photos) is showing on desktop — items outside it
  // get .is-desktop-hidden (a desktop-only CSS rule; mobile ignores it and
  // always shows every item in the scrollable strip)
  function updateDesktopSlide() {
    itemEls.forEach((item, i) => {
      const itemSlide = Math.floor(i / 2);
      item.classList.toggle("is-desktop-hidden", itemSlide !== currentSlide);
    });
  }
  updateDesktopSlide();

  // notification-style badge on the "next" arrow, counting photos still
  // hidden beyond what's currently shown — desktop's paged galleries hide
  // every other slide with no visual hint otherwise, and mobile's one-
  // photo-at-a-time strip has the same problem despite its fade-mask edge,
  // so both get it: "there's more here" should be impossible to miss.
  function currentMobileItemIndex() {
    // the item whose left edge has scrolled to (or past) the track's own
    // left edge is the one currently at the front of the visible strip
    const scrollLeft = track.scrollLeft;
    let idx = 0;
    for (let i = 0; i < itemEls.length; i++) {
      if (itemEls[i].offsetLeft <= scrollLeft + 2) idx = i;
    }
    return idx;
  }

  function updateNextBadge() {
    let remaining;
    if (isMobile()) {
      remaining = images.length - (currentMobileItemIndex() + 1);
    } else {
      if (!isPaged) {
        nextBadge.classList.remove("visible");
        return;
      }
      const shown = Math.min(images.length, (currentSlide + 1) * 2);
      remaining = images.length - shown;
    }
    if (remaining > 0) {
      nextBadge.textContent = String(remaining);
      nextBadge.classList.add("visible");
    } else {
      nextBadge.classList.remove("visible");
    }
  }

  // exposed on the card (see bottom of this function) so buildTimeline can
  // drive slide changes from vertical wheel scroll, not just arrow clicks
  function goToSlide(index) {
    currentSlide = Math.max(0, Math.min(slideCount - 1, index));
    updateDesktopSlide();
    updateGalleryArrows();
    updateNextBadge();
  }

  const prevArrow = makeArrowButton({
    className: "marquee-arrow timeline-gallery-arrow-btn timeline-gallery-arrow-prev",
    label: "Previous photo",
    glyph: "&#8592;",
    onClick: () => {
      if (isMobile()) {
        track.scrollTo({ left: Math.max(0, track.scrollLeft - track.clientWidth * 0.8), behavior: "smooth" });
      } else {
        goToSlide(currentSlide - 1);
      }
    }
  });

  const nextArrow = makeArrowButton({
    className: "marquee-arrow timeline-gallery-arrow-btn timeline-gallery-arrow-next",
    label: "Next photo",
    glyph: "&#8594;",
    onClick: () => {
      if (isMobile()) {
        const maxScroll = track.scrollWidth - track.clientWidth;
        track.scrollTo({ left: Math.min(maxScroll, track.scrollLeft + track.clientWidth * 0.8), behavior: "smooth" });
      } else {
        goToSlide(currentSlide + 1);
      }
    }
  });

  const nextBadge = document.createElement("span");
  nextBadge.className = "timeline-gallery-badge";
  nextBadge.setAttribute("aria-hidden", "true");
  nextArrow.appendChild(nextBadge);
  updateNextBadge();
  galleryMobileQuery.addEventListener("change", updateNextBadge);

  card.insertBefore(prevArrow, track);
  card.appendChild(nextArrow);

  function updateGalleryArrows() {
    if (isMobile()) {
      const maxScroll = track.scrollWidth - track.clientWidth;
      prevArrow.classList.toggle("is-hidden", track.scrollLeft <= 2);
      nextArrow.classList.toggle("is-hidden", track.scrollLeft >= maxScroll - 2);
    } else {
      prevArrow.classList.toggle("is-hidden", currentSlide <= 0);
      nextArrow.classList.toggle("is-hidden", currentSlide >= slideCount - 1);
    }
  }
  track.addEventListener("scroll", () => {
    updateGalleryArrows();
    updateNextBadge();
  });
  // the mobile/desktop split changes which criterion decides is-hidden, so
  // re-check on every breakpoint crossing, not just on scroll/click
  galleryMobileQuery.addEventListener("change", updateGalleryArrows);
  requestAnimationFrame(() => {
    updateGalleryArrows();
    updateNextBadge();
  });

  // mobile drag-to-scroll, same pattern as js/marquee.js. Pointer capture
  // is only claimed once a real drag is detected (not on every
  // pointerdown) — capturing immediately would reroute the click event
  // away from whichever child (a frame) was actually pressed, since a
  // captured pointer's synthesized click no longer resolves against the
  // original hit-tested target. That's also why the "open the lightbox"
  // click listener below lives on track (the capturing element) instead
  // of on each frame directly: delegation from an element that's
  // guaranteed to stay in the dispatch path, rather than a descendant
  // that pointer capture can route around.
  let dragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let capturedPointerId = null;
  track.addEventListener("pointerdown", (e) => {
    dragging = true;
    trackDragMoved = false;
    startX = e.clientX;
    startScrollLeft = track.scrollLeft;
    capturedPointerId = e.pointerId;
  });
  track.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (!trackDragMoved && Math.abs(dx) > 3) {
      trackDragMoved = true;
      track.setPointerCapture(capturedPointerId);
    }
    if (trackDragMoved) track.scrollLeft = startScrollLeft - dx;
  });
  function endDrag() {
    dragging = false;
  }
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  track.addEventListener("click", (e) => {
    if (trackDragMoved) return;
    // delegate from .timeline-gallery-photo (which wraps the "Open Image"
    // label AND the frame) so clicking the label text opens the lightbox
    // too, not just the photo itself
    const photoEl = e.target.closest(".timeline-gallery-photo");
    const frameEl = photoEl && photoEl.querySelector(".timeline-gallery-frame");
    if (!frameEl) return;
    openLightbox(lightboxImages, Number(frameEl.dataset.imageIndex));
  });

  return card;
}
