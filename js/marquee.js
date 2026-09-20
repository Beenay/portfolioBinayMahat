// One reusable horizontal logo strip: no auto-scrolling, no visible
// scrollbar. Moves only when the user drags it (mouse, same pointer-capture
// pattern as the timeline's spine drag in js/timeline.js), swipes it
// (touch/trackpad, native), or clicks the arrow, which nudges it forward
// by one "page" and loops back to the start once it runs out of room.
// Each item's logo+caption reads as one left-aligned block; a caption that
// doesn't fit its 2-line cap shows the rest in the shared hover tooltip
// (js/hovertooltip.js).

// containerEl becomes the scrollable strip itself. arrowSlotEl, if given,
// is where the scroll-forward arrow gets appended instead (e.g. next to
// the section's heading) — it controls containerEl's scroll regardless of
// where it physically sits in the page.
function buildMarquee(containerEl, items, arrowSlotEl) {
  containerEl.classList.add("marquee");

  const track = document.createElement("div");
  track.className = "marquee-track";

  items.forEach((it) => {
    const item = document.createElement("div");
    item.className = "marquee-item";

    const img = document.createElement("img");
    img.className = "marquee-logo";
    img.src = it.src;
    img.alt = it.alt || it.caption || "";
    img.loading = "lazy";
    img.decoding = "async";
    if (it.w && it.h) { img.width = it.w; img.height = it.h; }
    if (it.whiteBg) {
      const badge = document.createElement("div");
      badge.className = "marquee-logo-badge";
      badge.appendChild(img);
      item.appendChild(badge);
    } else {
      item.appendChild(img);
    }

    if (it.caption) {
      const caption = document.createElement("p");
      caption.className = "marquee-caption";
      if (it.centerCaption) caption.classList.add("marquee-caption-center");
      caption.textContent = it.caption;
      item.appendChild(caption);

      // only bother with a tooltip if the 2-line clamp actually cut
      // something off
      item.addEventListener("mouseenter", () => {
        if (caption.scrollHeight > caption.clientHeight + 1) {
          showHoverTooltip(item, it.caption);
        }
      });
      item.addEventListener("mouseleave", hideHoverTooltip);
    }

    track.appendChild(item);
  });

  containerEl.appendChild(track);

  const arrow = makeArrowButton({
    className: "marquee-arrow",
    label: "Scroll for more",
    glyph: "&#8594;",
    onClick: () => {
      const atEnd = containerEl.scrollLeft + containerEl.clientWidth >= containerEl.scrollWidth - 4;
      containerEl.scrollTo({
        left: atEnd ? 0 : containerEl.scrollLeft + containerEl.clientWidth * 0.8,
        behavior: "smooth"
      });
    }
  });
  (arrowSlotEl || containerEl).appendChild(arrow);

  // click-and-drag to scroll horizontally with the mouse
  let dragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = false;

  containerEl.addEventListener("pointerdown", (e) => {
    dragging = true;
    moved = false;
    startX = e.clientX;
    startScrollLeft = containerEl.scrollLeft;
    containerEl.classList.add("dragging");
    containerEl.setPointerCapture(e.pointerId);
    hideHoverTooltip();
  });

  containerEl.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 3) moved = true;
    containerEl.scrollLeft = startScrollLeft - dx;
  });

  function endDrag() {
    dragging = false;
    containerEl.classList.remove("dragging");
  }
  containerEl.addEventListener("pointerup", endDrag);
  containerEl.addEventListener("pointercancel", endDrag);

  // a drag that actually moved the strip shouldn't also register as a click
  // on whatever's underneath the pointer
  containerEl.addEventListener("click", (e) => {
    if (moved) e.preventDefault();
  }, true);
}
