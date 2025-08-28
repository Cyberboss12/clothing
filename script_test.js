const products = [
  { img: "afbeeldingen/model.jpg", label: "Men" },
  { img: "afbeeldingen/model.jpg", label: "Women" },
  { img: "afbeeldingen/model.jpg", label: "Children" },
  { img: "afbeeldingen/model.jpg", label: "Discover" },
  { img: "afbeeldingen/model.jpg", label: "5" },
  { img: "afbeeldingen/model.jpg", label: "6" },
  { img: "afbeeldingen/model.jpg", label: "7" },
  { img: "afbeeldingen/model.jpg", label: "8" },
  { img: "afbeeldingen/model.jpg", label: "9" },
  { img: "afbeeldingen/model.jpg", label: "10" },
  { img: "afbeeldingen/model.jpg", label: "11" },
  { img: "afbeeldingen/model.jpg", label: "12" }
];

// veronderstelt: products + showBatch() zijn al gedefinieerd
const section = document.getElementById("productSection");
const grid = document.getElementById("productGrid");

let index = 0;
const batchSize = 4;
let lock = false;

// instellingen
const SCROLL_THRESHOLD = 6;   // gevoelig maar single-step
const LOCK_MS = 350;          // korte lock om inertie te blokkeren
const TOUCH_THRESHOLD = 20;   // swipe drempel (px)

// init eerste batch (gebruik jouw bestaande showBatch invocatie)
showBatch(index);

// helper: één stap triggeren (down/up)
function triggerStep(direction) {
  if (lock) return false;
  if (direction === 'down' && index + batchSize < products.length) {
    index += batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => lock = false, LOCK_MS);
    return true;
  } else if (direction === 'up' && index - batchSize >= 0) {
    index -= batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => lock = false, LOCK_MS);
    return true;
  }
  return false;
}

/* -------------------------
   Robuuste "pointer inside" state
   ------------------------- */
let pointerInside = false;
let pointerTimeout = null;

function setPointerInside(val) {
  pointerInside = val;
  if (pointerTimeout) {
    clearTimeout(pointerTimeout);
    pointerTimeout = null;
  }
  if (val === false) {
    // houd korte grace periode zodat kleine pointer-overs gaan niet meteen false maken
    pointerTimeout = setTimeout(() => pointerInside = false, 120);
  }
}

// pointer events
section.addEventListener('pointerenter', () => setPointerInside(true));
section.addEventListener('pointerleave', () => setPointerInside(false));

// mousemove fallback: als gebruiker beweegt binnen sectie, refresh de state
// (soms pointerenter/leave kunnen raar gedrag geven bij iframes/scrollbars)
section.addEventListener('mousemove', () => setPointerInside(true), { passive: true });

/* -------------------------
   Wheel handler (globaal) — maar handelen alleen wanneer event 'inside' is
   ------------------------- */
function isEventInsideSection(e) {
  // 1) pointerInside flag
  if (pointerInside) return true;

  // 2) target in path
  try {
    if (e && e.composedPath) {
      const path = e.composedPath();
      if (path && path.indexOf && path.indexOf(section) !== -1) return true;
    }
  } catch (err) { /* ignore */ }

  // 3) target is child of section
  if (e.target && section.contains(e.target)) return true;

  // 4) elementFromPoint fallback (works for trackpad/mouse)
  if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (el && section.contains(el)) return true;
  }

  // 5) keyboard-focus fallback: als een child van section gefocust is
  if (document.activeElement && section.contains(document.activeElement)) return true;

  return false;
}

function onWindowWheel(e) {
  // alleen relevant als event binnen sectie is (robuste check)
  if (!isEventInsideSection(e)) return;

  // normaliseer delta
  const PIXEL_PER_LINE = 16;
  const deltaY = (e.deltaMode === 1) ? e.deltaY * PIXEL_PER_LINE : e.deltaY;

  // als we locked zijn: blokkeer inertie zodat de pagina niet mee beweegt
  if (lock) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  // heel kleine waardes negeren
  if (Math.abs(deltaY) < 0.5) return;

  // richting bepalen en 1 stap triggeren (single-step)
  let didSwitch = false;
  if (deltaY > SCROLL_THRESHOLD) {
    didSwitch = triggerStep('down');
  } else if (deltaY < -SCROLL_THRESHOLD) {
    didSwitch = triggerStep('up');
  }

  // alleen blokkeren als we daadwerkelijk wisselen — anders mag de pagina doorscrollen
  if (didSwitch) {
    e.preventDefault();
    e.stopPropagation();
  }
}
// luister op window om ook trackpad-inertie te vangen
window.addEventListener('wheel', onWindowWheel, { passive: false });

/* -------------------------
   Touch handling (mobile)
   ------------------------- */
let touchStartY = null;
section.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) {
    touchStartY = e.touches[0].clientY;
    setPointerInside(true); // assume user interacts with section
  }
}, { passive: true });

section.addEventListener("touchmove", (e) => {
  if (lock || touchStartY === null) {
    // als locked: blokkeren we inertie
    if (lock) {
      e.preventDefault();
      e.stopPropagation();
    }
    return;
  }

  const y = e.touches[0].clientY;
  const dy = touchStartY - y;

  if (dy > TOUCH_THRESHOLD) {
    const did = triggerStep('down');
    if (did) {
      e.preventDefault();
      e.stopPropagation();
    }
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) {
    const did = triggerStep('up');
    if (did) {
      e.preventDefault();
      e.stopPropagation();
    }
    touchStartY = null;
  }
}, { passive: false });

section.addEventListener("touchend", () => {
  touchStartY = null;
  // allow pointerInside to decay via timeout
}, { passive: true });

