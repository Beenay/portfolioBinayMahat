// A scrollytelling timeline section: the surrounding <section> is much
// taller than 100vh (see the inline height set below), and its inner
// .timeline-sticky pins to the viewport while that extra height scrolls
// past.
//
// The spine's sequence isn't just events — each TIMELINE group's year is
// its own stop woven directly in (year, event, event, year, event, event,
// ...), all sharing one combined position space. rawIndex is a single
// continuous number over that combined sequence (e.g. 3.4 means 40% of
// the way from combined stop 3 to stop 4), and every visual — event
// brightness/scale, year-marker brightness, the stacked image cards, and
// the fill — is a pure function of distance from rawIndex, recomputed
// every frame. Stops sit at fixed, evenly-spaced positions (bare,
// unlabeled tips above the first and below the last — see STICK_INSET_PCT
// in js/stick.js), exactly the same model as the right-edge page nav in
// js/pagenav.js; the shared mechanics live in js/stick.js.
// Crossing a year boundary therefore takes about twice the scroll of
// moving between two events in the same year, since a marker now
// occupies a real stop in between.

function buildTimeline() {
  const scroller = document.getElementById("scroller");
  const section = document.getElementById("segment-timeline");
  const spineCol = document.getElementById("timelineSpine");
  const stage = document.getElementById("timelineStage");
  const spineFill = document.getElementById("timelineSpineFill");
  if (!section) return;

  // flatten TIMELINE's groups into one ordered list, for the cards (which
  // are keyed to events only, never to a year marker)
  const events = [];
  TIMELINE.forEach((group, groupIndex) => {
    group.events.forEach((ev) => events.push({ ...ev, groupIndex }));
  });

  // the combined stop sequence: one year marker per group, immediately
  // followed by that group's events — and, wherever an event has a
  // `textBefore` (js/data.js), a text-only stop right before it
  const stops = []; // { type: "marker", year } | { type: "text", text } | { type: "event", eventIndex }
  let eventCursor = 0;
  TIMELINE.forEach((group) => {
    stops.push({ type: "marker", year: group.range.split(" ")[0] });
    group.events.forEach((ev) => {
      if (ev.textBefore) stops.push({ type: "text", text: ev.textBefore });
      stops.push({ type: "event", eventIndex: eventCursor });
      eventCursor += 1;
    });
  });

  const CARD_STEP = 260;    // px between adjacent image cards at rest
  const EXTRA_VH_PER_STOP = 55; // how much extra scroll room each combined stop gets

  section.style.height = `calc(100vh + ${(stops.length - 1) * EXTRA_VH_PER_STOP}vh)`;

  // Stops sit at fixed positions on the spine, inset from its ends
  // (STICK_INSET_PCT in js/stick.js, shared with the page nav). The spine's
  // overall length never changes; what changes is how that fixed length is
  // divided up: a gap touching a text stop is compressed (COMPRESSED_GAP
  // instead of 1), so e.g. "Social Work" sits closer to "2015" and to
  // "Projects and Events Management" than a normal event-to-event gap,
  // without shortening the spine itself.
  const COMPRESSED_GAP = 0.45;

  const cumulativeWeight = [0];
  for (let i = 1; i < stops.length; i++) {
    const compressed = stops[i].type === "text" || stops[i - 1].type === "text";
    cumulativeWeight.push(cumulativeWeight[i - 1] + (compressed ? COMPRESSED_GAP : 1));
  }
  const stopPercent = makeStopPercent(cumulativeWeight);

  // each event's position within the combined sequence (skips over the
  // year-marker slots)
  const eventCombinedIndex = [];
  stops.forEach((stop, i) => {
    if (stop.type === "event") eventCombinedIndex[stop.eventIndex] = i;
  });

  const eventEls = events.map((ev, i) => {
    const el = document.createElement("div");
    el.className = "timeline-event";
    el.style.top = `${stopPercent(eventCombinedIndex[i])}%`;
    const dot = document.createElement("span");
    dot.className = "timeline-event-dot";
    const label = document.createElement("span");
    label.className = "timeline-event-label";
    // one word per line, same treatment as the page nav's labels
    // (js/pagenav.js), so a multi-word label never eats into the image
    // stage's width
    ev.label.split(" ").forEach((word) => {
      const wordEl = document.createElement("span");
      wordEl.textContent = word;
      label.appendChild(wordEl);
    });
    el.appendChild(dot);
    el.appendChild(label);
    spineCol.appendChild(el);
    return el;
  });

  // one year marker per group, infused directly into the sequence right
  // before that group's events — not a side label tied to a span
  const markerEls = stops
    .map((stop, i) => ({ stop, combinedIndex: i }))
    .filter(({ stop }) => stop.type === "marker")
    .map(({ stop, combinedIndex }) => {
      const el = document.createElement("div");
      el.className = "timeline-year-marker";
      el.style.top = `${stopPercent(combinedIndex)}%`;
      el.textContent = stop.year;
      spineCol.appendChild(el);
      return { el, combinedIndex };
    });

  // text-only stops (js/data.js's per-event `textBefore`) — plain text
  // stage cards, fisheye-animated exactly like every other card, but with
  // no spine dot/label of their own (unlike events and year markers).
  // The shared .timeline-intro-card modifier (not the generic
  // .timeline-card width) lets each one use the full space between the
  // two side sticks instead of the narrower image-card width.
  const textCardEls = stops
    .map((stop, i) => ({ stop, combinedIndex: i }))
    .filter(({ stop }) => stop.type === "text")
    .map(({ stop, combinedIndex }) => {
      const card = document.createElement("div");
      card.className = "timeline-card timeline-intro-card";
      const line = document.createElement("p");
      line.className = "timeline-intro-line";
      line.textContent = stop.text;
      card.appendChild(line);
      stage.appendChild(card);
      return { el: card, combinedIndex };
    });

  const cardEls = events.map((ev) => {
    // an event with an "images" array (a whole segment/group of photos,
    // not just one) gets the gallery layout: a two-item grid on desktop
    // (second item's caption/photo order flipped, for the zigzag look),
    // a draggable-and-arrow horizontal strip on mobile — the exact same
    // scroll mechanic as the hero page's marquees (js/marquee.js), reusing
    // its .marquee-arrow styling and its caption-truncation tooltip.
    if (ev.images && ev.images.length > 0) {
      const card = buildGalleryCard(ev.images, ev.label);
      stage.appendChild(card);
      return card;
    }

    const card = document.createElement("div");
    card.className = "timeline-card";

    const frame = document.createElement("div");
    frame.className = "timeline-card-frame";
    if (ev.image) {
      const img = document.createElement("img");
      img.className = "timeline-card-photo";
      img.src = ev.image;
      img.alt = ev.description || ev.label;
      frame.appendChild(img);
    } else {
      frame.style.background = ev.color;
    }
    card.appendChild(frame);

    const desc = document.createElement("p");
    desc.className = "timeline-card-description";
    desc.textContent = ev.description || "";
    card.appendChild(desc);

    stage.appendChild(card);
    return card;
  });

  let rawIndex = 0; // continuous position over the COMBINED stop sequence

  function render() {
    // true whenever the currently-selected event has real photos — the
    // Memory Lane credits note only shows during those, never during a
    // text-only stop (intro, "textBefore" interstitials) or a year marker
    let imageEventSelected = false;

    events.forEach((ev, i) => {
      const dist = eventCombinedIndex[i] - rawIndex;
      const proximity = Math.max(0, 1 - Math.abs(dist));

      // position is fixed (set once, above) — only brightness/size react
      // to how close this event is to the current scroll position
      const eventScale = 0.85 + 0.25 * proximity;
      eventEls[i].style.transform = `translateY(-50%) scale(${eventScale})`;
      eventEls[i].style.opacity = (0.35 + 0.65 * proximity).toFixed(2);
      const selected = proximity > 0.5;
      eventEls[i].classList.toggle("selected", selected);
      if (selected && ev.images && ev.images.length > 0) imageEventSelected = true;

      // the stacked image cards keep their own separate fisheye/handoff
      // effect, driven off the same combined-space distance — a card
      // separated from the current position by a year marker is farther
      // in this distance than one right next door, which is the point.
      // No opacity floor: once a card is a full step away it's fully
      // gone, not lingering as a faint ghost behind the current one.
      const cardScale = 0.4 + 0.6 * proximity;
      cardEls[i].style.transform =
        `translate(-50%, -50%) translateY(${dist * CARD_STEP}px) scale(${cardScale})`;
      cardEls[i].style.opacity = proximity.toFixed(2);
      cardEls[i].style.zIndex = String(Math.round(proximity * 100));
      cardEls[i].style.pointerEvents = proximity > 0.5 ? "auto" : "none";
    });

    // rawIndex clamps to the last stop once scrolled past the section, so
    // only show the note while the section is actually pinned in view —
    // otherwise it lingers over More about Me / My Story / Credits
    const sectionRect = section.getBoundingClientRect();
    const sectionPinned = sectionRect.top <= 2 && sectionRect.bottom >= window.innerHeight - 2;
    const creditsNote = document.getElementById("timelineCreditsNote");
    if (creditsNote) creditsNote.classList.toggle("visible", imageEventSelected && sectionPinned);

    markerEls.forEach(({ el, combinedIndex }) => {
      const proximity = Math.max(0, 1 - Math.abs(combinedIndex - rawIndex));
      el.style.opacity = (0.4 + 0.5 * proximity).toFixed(2);
    });

    textCardEls.forEach(({ el, combinedIndex }) => {
      const dist = combinedIndex - rawIndex;
      const proximity = Math.max(0, 1 - Math.abs(dist));
      const cardScale = 0.4 + 0.6 * proximity;
      el.style.transform = `translate(-50%, -50%) translateY(${dist * CARD_STEP}px) scale(${cardScale})`;
      el.style.opacity = proximity.toFixed(2);
      el.style.zIndex = String(Math.round(proximity * 100));
    });

    // fill spans exactly the first stop's tip to the last stop's tip (the
    // same inset range the stops sit in) — the bare spine tips above/below
    // never fill
    if (spineFill) {
      spineFill.style.height = `${stopPercent(rawIndex).toFixed(1)}%`;
    }
  }

  function updateFromScroll() {
    const rect = section.getBoundingClientRect();
    const scrollableHeight = rect.height - window.innerHeight;
    const scrolledIn = -rect.top;
    const progress = scrollableHeight > 0
      ? Math.max(0, Math.min(1, scrolledIn / scrollableHeight))
      : 0;
    rawIndex = progress * (stops.length - 1);
    render();
  }

  everyFrame(updateFromScroll);

  // ---- turn a target combined-stop index (0..stops.length-1, fractional
  // ok) into the real scrollTop that produces it — dragging/clicking moves
  // the actual page scroll, never a separate local state, so this stays
  // the single source of truth everything else reads
  // too ----
  function indexToScrollTop(index) {
    const progress = stops.length > 1
      ? Math.max(0, Math.min(1, index / (stops.length - 1)))
      : 0;
    const rect = section.getBoundingClientRect();
    const sectionTopInScroller = rect.top + scroller.scrollTop;
    const scrollableHeight = section.offsetHeight - window.innerHeight;
    return sectionTopInScroller + progress * Math.max(0, scrollableHeight);
  }

  // ---- dragging the spine and clicking an event: shared mechanics, see
  // js/stick.js ----
  attachStickDrag({ scroller, stickEl: spineCol, stopCount: stops.length, indexToScrollTop });
  eventEls.forEach((el, i) => {
    el.classList.add("clickable");
    attachStopClick({ scroller, el, getScrollTop: () => indexToScrollTop(eventCombinedIndex[i]) });
  });
}

buildTimeline();
