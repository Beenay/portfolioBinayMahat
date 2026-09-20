// One shared hover tooltip (a single lazily-created element, positioned
// with position:fixed so no scroll box or overflow:hidden clips it). Used
// wherever a caption is clamped to a few lines and needs to show the rest
// on hover/click: the hero logo strips (js/marquee.js) and the timeline
// photo captions (js/timeline.js).

let hoverTooltipEl = null;
function getHoverTooltip() {
  if (!hoverTooltipEl) {
    hoverTooltipEl = document.createElement("div");
    hoverTooltipEl.className = "hover-tooltip";
    document.body.appendChild(hoverTooltipEl);
  }
  return hoverTooltipEl;
}

function showHoverTooltip(anchorEl, text) {
  const tip = getHoverTooltip();
  tip.textContent = text;
  tip.style.display = "block";
  const anchorRect = anchorEl.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  const left = Math.min(anchorRect.left, window.innerWidth - tipRect.width - 8);
  tip.style.left = `${Math.max(8, left)}px`;
  tip.style.top = `${anchorRect.bottom + 8}px`;
}

function hideHoverTooltip() {
  if (hoverTooltipEl) hoverTooltipEl.style.display = "none";
}
