// Background music: a hidden YouTube-embedded player synced to the ship.
//
// TODO: swap this for the actual video ID of the copyright-free track you
// pick — it's the part of the YouTube URL after "v=" (e.g. for
// https://www.youtube.com/watch?v=dQw4w9WgXcQ it would be "dQw4w9WgXcQ").
// Until this is set, the play/pause button stays disabled.
const YOUTUBE_VIDEO_ID = "gCWaRhNUvfc";

let ytPlayer = null;
let playerReady = false;
let userPaused = false; // once the user pauses manually, ship movement no
                         // longer auto-resumes it — matches the ask exactly
let hasAutoStarted = false;
let playWhenReady = false; // play button pressed before the player finished loading
let currentVolume = 50; // 0-100, kept even before the player is ready so the
                         // dial can be dragged immediately and synced on load

function loadYouTubeApi() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) { resolve(); return; }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = resolve;
  });
}

function createMusicPlayer(button) {
  return loadYouTubeApi().then(() => {
    ytPlayer = new YT.Player("ytPlayer", {
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 0,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID // required by the API for looping a single video
      },
      events: {
        onReady: () => {
          playerReady = true;
          ytPlayer.setVolume(currentVolume); // sync to whatever the dial was set to
          if (playWhenReady) { playWhenReady = false; ytPlayer.playVideo(); }
        },
        onStateChange: (e) => {
          button.classList.toggle("playing", e.data === YT.PlayerState.PLAYING);
        }
      }
    });
  });
}

function initMusicPlayer() {
  const button = document.getElementById("musicToggle");
  if (!button) return;

  if (YOUTUBE_VIDEO_ID === "REPLACE_WITH_VIDEO_ID") {
    button.disabled = true;
    button.title = "No track set yet";
    return;
  }

  // The YouTube player is a heavy third-party download, so it only starts
  // loading on the visitor's first interaction (scroll, tap, key) instead
  // of blocking the page load. Music still auto-starts once the ship first
  // moves, and the play button works straight away (it waits for the player).
  let playerRequested = false;
  function requestPlayer() {
    if (playerRequested) return;
    playerRequested = true;
    ["pointerdown", "keydown", "wheel", "touchstart", "scroll"].forEach((t) =>
      window.removeEventListener(t, requestPlayer, true)
    );
    createMusicPlayer(button);
  }
  ["pointerdown", "keydown", "wheel", "touchstart", "scroll"].forEach((t) =>
    window.addEventListener(t, requestPlayer, { capture: true, passive: true })
  );
  window.requestMusicPlayer = requestPlayer;

  button.addEventListener("click", () => {
    if (!playerReady) {
      // not loaded yet: start loading and play the moment it's ready
      userPaused = false;
      playWhenReady = true;
      requestPlayer();
      return;
    }
    if (ytPlayer.getPlayerState() === YT.PlayerState.PLAYING) {
      ytPlayer.pauseVideo();
      userPaused = true;
    } else {
      ytPlayer.playVideo();
      userPaused = false;
    }
  });

  wireVolumeDial();
}

// ---- volume dial: drag the ring (mouse or touch), or focus it and use the
// arrow keys — the actual hardware volume buttons on a keyboard can't be
// read by a webpage (that's the OS's job), so arrow keys are the real
// keyboard-accessible equivalent here. ----
function wireVolumeDial() {
  const control = document.getElementById("musicControl");
  const fill = document.getElementById("volumeFill");
  if (!control || !fill) return;

  const RADIUS = 28;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  fill.style.strokeDasharray = `${CIRCUMFERENCE}`;

  function render(percent) {
    const offset = CIRCUMFERENCE * (1 - percent / 100);
    fill.style.strokeDashoffset = `${offset}`;
    control.setAttribute("aria-valuenow", Math.round(percent));
  }

  function setVolume(percent) {
    currentVolume = Math.max(0, Math.min(100, percent));
    render(currentVolume);
    if (playerReady) ytPlayer.setVolume(currentVolume);
  }

  function percentFromPoint(clientX, clientY) {
    const rect = control.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let angle = Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return (angle / 360) * 100;
  }

  let dragging = false;

  control.addEventListener("pointerdown", (e) => {
    if (e.target.closest("#musicToggle")) return; // the button handles its own click
    dragging = true;
    control.setPointerCapture(e.pointerId);
    setVolume(percentFromPoint(e.clientX, e.clientY));
  });

  control.addEventListener("pointermove", (e) => {
    if (dragging) setVolume(percentFromPoint(e.clientX, e.clientY));
  });

  control.addEventListener("pointerup", () => { dragging = false; });
  control.addEventListener("pointercancel", () => { dragging = false; });

  control.addEventListener("keydown", (e) => {
    const step = 5;
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      setVolume(currentVolume + step);
      e.preventDefault();
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      setVolume(currentVolume - step);
      e.preventDefault();
    } else if (e.key === "Home") {
      setVolume(0);
      e.preventDefault();
    } else if (e.key === "End") {
      setVolume(100);
      e.preventDefault();
    }
  });

  render(currentVolume);
}

// Called continuously while the ship is actually moving (see js/main.js).
// Only takes action the first time it sees real movement, and never
// overrides a manual pause.
function notifyShipMoved() {
  if (!playerReady || userPaused || hasAutoStarted) return;
  hasAutoStarted = true;
  ytPlayer.playVideo();
}
window.notifyShipMoved = notifyShipMoved;

initMusicPlayer();
