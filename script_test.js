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

// instellingen
const SCROLL_THRESHOLD = 6;   // zeer gevoelig
const LOCK_MS = 300;          // voorkomt overslaan
const TOUCH_THRESHOLD = 20;   // swipe gevoeligheid

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

showBatch(index);

function triggerStep(direction) {
  if (lock) return false;
  if (direction === "down" && index + batchSize < products.length) {
    index += batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => lock = false, LOCK_MS);
    return true;
  } else if (direction === "up" && index - batchSize >= 0) {
    index -= batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => lock = false, LOCK_MS);
    return true;
  }
  return false;
}

// wheel handler
section.addEventListener("wheel", (e) => {
  const PIXEL_PER_LINE = 16;
  const deltaY = (e.deltaMode === 1) ? e.deltaY * PIXEL_PER_LINE : e.deltaY;

  if (lock) {
    e.preventDefault();
    return;
  }

  let didSwitch = false;

  if (deltaY > SCROLL_THRESHOLD) {
    didSwitch = triggerStep("down");
  } else if (deltaY < -SCROLL_THRESHOLD) {
    didSwitch = triggerStep("up");
  }

  // alleen blokkeren als er echt een batch is gewisseld
  if (didSwitch) {
    e.preventDefault();
    e.stopPropagation();
  }
}, { passive: false });

// touch support
let touchStartY = null;

section.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener("touchmove", (e) => {
  if (!touchStartY || lock) return;

  const y = e.touches[0].clientY;
  const dy = touchStartY - y;
  let didSwitch = false;

  if (dy > TOUCH_THRESHOLD) {
    didSwitch = triggerStep("down");
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) {
    didSwitch = triggerStep("up");
    touchStartY = null;
  }

  if (didSwitch) {
    e.preventDefault();
    e.stopPropagation();
  }
}, { passive: false });

section.addEventListener("touchend", () => touchStartY = null, { passive: true });


