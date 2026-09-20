// One place that builds an arrow button, so the hero logo strips
// (js/marquee.js), the timeline photo gallery (js/timeline.js) and the
// lightbox (js/lightbox.js) don't each hand-roll the same <button>. Only
// the button is shared: what a click DOES stays with each caller.
//   className - the button's CSS class(es), which also decide its look
//   label     - accessible name (aria-label)
//   glyph     - the arrow character, as an HTML entity like "&#8594;"
//   onClick   - click handler
function makeArrowButton({ className, label, glyph, onClick }) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = className;
  btn.setAttribute("aria-label", label);
  btn.innerHTML = glyph;
  btn.addEventListener("click", onClick);
  return btn;
}
