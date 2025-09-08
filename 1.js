const section = document.getElementById("productSection");
const grid = document.getElementById("productGrid");
const extraContent = document.querySelector("#extraContent");

let index = 0;
const batchSize = 4;
let lock = false;
const LOCK_MS = 600;
const TOUCH_THRESHOLD = 20;
let extraScrollLock = false; // voorkomt dubbel scrollen

// ========================
// 4. Batches renderen
// ========================
function showBatch(startIndex) {
  grid.innerHTML = "";
  const slice = products.slice(startIndex, startIndex + batchSize);

  slice.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    if (p.link) {
      div.innerHTML = `
        <a href="${p.link}" style="display:block;text-decoration:none;color:inherit;">
          <img src="${p.img}" alt="${p.label}">
          <div class="product-label">${p.label}</div>
        </a>
      `;
    } else {
      div.innerHTML = `
        <img src="${p.img}" alt="${p.label}">
        <div class="product-label">${p.label}</div>
      `;
    }

    grid.appendChild(div);
    requestAnimationFrame(() => div.classList.add("loaded"));
  });
}
showBatch(index);

// ========================
// 5. Carousel trigger
// ========================
function triggerStep(direction) {
  if (lock) return;

  if (direction === "down" && index + batchSize < products.length) {
    index += batchSize;
    showBatch(index);
  } else if (direction === "up" && index - batchSize >= 0) {
    index -= batchSize;
    showBatch(index);
  }

  lock = true;
  setTimeout(() => (lock = false), LOCK_MS);
}

function atBatch3() {
  return index >= products.length - batchSize;
}

// ========================
// 6. Smooth scroll helpers
// ========================
function scrollToExtraContent() {
  extraContent.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToBatch3() {
  if (extraScrollLock) return;

  // laatste batch renderen
  index = products.length - batchSize;
  showBatch(index);

  // header + info-bar actief houden
  const headerEl = document.getElementById("siteHeader");
  const infoEl = document.getElementById("infoBar");
  if (headerEl) {
    headerEl.style.opacity = "1";
    headerEl.style.pointerEvents = "auto";
  }
  if (infoEl) {
    infoEl.style.opacity = "1";
    infoEl.style.pointerEvents = "auto";
  }

  // scroll helemaal naar boven
  extraScrollLock = true;
  window.scrollTo({ top: 0, behavior: "smooth" });

  // lock vrijgeven na animatie
  setTimeout(() => { extraScrollLock = false; }, 900);
}

// ========================
// 7. Event handlers
// ========================

// Mouse wheel / touchpad
window.addEventListener("wheel", (e) => {
  const deltaY = e.deltaY;

  if (deltaY > 0) { // scroll down
    if (!atBatch3()) {
      e.preventDefault();
      triggerStep("down");
    } else {
      e.preventDefault();
      scrollToExtraContent();
    }
  } else if (deltaY < 0) { // scroll up
    if (window.scrollY > section.offsetTop) {
      e.preventDefault();
      scrollToBatch3();
    } else {
      e.preventDefault();
      triggerStep("up");
    }
  }
}, { passive: false });

// Pijltoetsen
window.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") {
    if (!atBatch3()) triggerStep("down");
    else scrollToExtraContent();
  } else if (e.key === "ArrowUp") {
    if (window.scrollY > section.offsetTop) scrollToBatch3();
    else triggerStep("up");
  }
});

// Touch
let touchStartY = null;
section.addEventListener("touchstart", e => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener("touchmove", e => {
  if (touchStartY === null) return;
  const dy = touchStartY - e.touches[0].clientY;

  if (dy > TOUCH_THRESHOLD) { // swipe up
    if (!atBatch3()) triggerStep("down");
    else scrollToExtraContent();
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) { // swipe down
    if (window.scrollY > section.offsetTop) {
      e.preventDefault();
      scrollToBatch3();
    } else {
      triggerStep("up");
    }
    touchStartY = null;
  }
}, { passive: false });

section.addEventListener("touchend", () => { touchStartY = null; });