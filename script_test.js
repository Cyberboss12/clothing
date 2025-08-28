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

const section = document.getElementById("productSection");
const grid = document.getElementById("productGrid");

let index = 0;
const batchSize = 4;
let lock = false;

// instellingen: zeer gevoelig maar single-step
const SCROLL_THRESHOLD = 6;   // klein = zeer gevoelig
const LOCK_MS = 300;         // na trigger korte lock zodat niet meerdere batches geskippt worden
const TOUCH_THRESHOLD = 20;  // swipe gevoelige drempel (px)

// showBatch blijft hetzelfde
function showBatch(startIndex) {
  grid.innerHTML = "";
  const slice = products.slice(startIndex, startIndex + batchSize);
  slice.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.label}">
      <div class="product-label">${p.label}</div>
    `;
    grid.appendChild(div);
    requestAnimationFrame(() => div.classList.add("loaded"));
  });
}

// init eerste batch
showBatch(index);

// helper: trigger één stap (down of up)
function triggerStep(direction) {
  if (lock) return;
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

// wheel handler (op sectie)
section.addEventListener("wheel", (e) => {
  // normaliseer deltaY voor deltaMode (lines vs pixels)
  const PIXEL_PER_LINE = 16; // grove vuistregel
  const deltaY = (e.deltaMode === 1) ? e.deltaY * PIXEL_PER_LINE : e.deltaY;

  // als we al locked zijn, negeren we (voorkomt skip door inertie)
  if (lock) return;

  // zeer gevoelig: kleine bewegingen tellen, maar we triggeren slechts 1 step per lock
  if (deltaY > SCROLL_THRESHOLD) {
    // probeer next batch; als dat lukt, blokkeer page scroll
    const did = triggerStep('down');
    if (did) {
      e.preventDefault();
      e.stopPropagation();
    }
  } else if (deltaY < -SCROLL_THRESHOLD) {
    const did = triggerStep('up');
    if (did) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}, { passive: false });

// touch support: 1 swipe = 1 rij
let touchStartY = null;
section.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener("touchmove", (e) => {
  if (!touchStartY || lock) return;

  const y = e.touches[0].clientY;
  const dy = touchStartY - y; // positief = swipe up

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

section.addEventListener("touchend", () => touchStartY = null, { passive: true });


