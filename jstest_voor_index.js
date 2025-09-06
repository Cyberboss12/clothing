// Alle boodschappen die je wilt tonen
const messages = [
  "Welkom bij onze webshop!",
  "Gratis verzending vanaf €50",
  "Vandaag: 10% korting op alle tassen",
  "Nieuw binnen: lente collectie 🌸",
  "Sign up to recieve 15% off on your next order!",
  "Free shipping on orders above €150",
  "Sign up to our community newsletter!"
];

const infoMessage = document.getElementById('infoMessage');
let msgIndex = 0;

function showNextMessage() {
  // Verberg huidige tekst
  infoMessage.classList.add('hidden');

  // Wacht tot fade-out klaar is (500ms uit CSS)
  setTimeout(() => {
    // Nieuwe boodschap instellen
    msgIndex = (msgIndex + 1) % messages.length;
    infoMessage.textContent = messages[msgIndex];

    // Fade-in
    infoMessage.classList.remove('hidden');
  }, 500);
}

// Elke 4 seconden wisselen van boodschap
setInterval(showNextMessage, 4000);

const products = [
  { img: "afbeeldingen/model.jpg", label: "Men" },
  { img: "afbeeldingen/model.jpg", label: "Women", link: "women.html" },
  { img: "afbeeldingen/model.jpg", label: "Children", link: "children.html" },
  { img: "afbeeldingen/boom.jpg", label: "Discover" },
  { img: "afbeeldingen/Black square_test.png", label: "5" },
  { img: "afbeeldingen/model.jpg", label: "6" },
  { img: "afbeeldingen/model.jpg", label: "7" },
  { img: "afbeeldingen/model.jpg", label: "8" },
  { img: "afbeeldingen/model.jpg", label: "9" },
  { img: "afbeeldingen/model.jpg", label: "10" },
  { img: "afbeeldingen/model.jpg", label: "11" },
  { img: "afbeeldingen/model.jpg", label: "12" }
];

// aannemende dat `products` al gedefinieerd is
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
// Helper: header state
// ========================
// states: "normal" (batches 1-2, info hidden), "full" (batch 3, info visible), "compact" (extraContent)
function updateHeaderState(state) {
  const headerEl = document.getElementById("siteHeader");
  const infoEl = document.getElementById("infoBar");
  if (!headerEl || !infoEl) return;

  // reset classes we use
  headerEl.classList.remove("header-compact", "header-visible");
  infoEl.classList.remove("header-visible");

  // ensure header is visible (fall back to inline styles so we don't depend 100% on CSS)
  headerEl.style.pointerEvents = "auto";
  infoEl.style.pointerEvents = "auto";

  if (state === "normal") {
    // original size, info hidden
    headerEl.classList.add("header-visible");
    headerEl.classList.remove("header-compact");
    infoEl.style.opacity = "0";
    infoEl.style.pointerEvents = "none";
  } else if (state === "full") {
    // original size, info visible
    headerEl.classList.add("header-visible");
    headerEl.classList.remove("header-compact");
    infoEl.style.opacity = "1";
    infoEl.style.pointerEvents = "auto";
  } else if (state === "compact") {
    // compact header + info visible
    headerEl.classList.add("header-visible", "header-compact");
    infoEl.style.opacity = "1";
    infoEl.style.pointerEvents = "auto";
  }
}

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
// initial render + initial header state
showBatch(index);
if (index < products.length - batchSize) updateHeaderState("normal");
else updateHeaderState("full");

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

  // Update header state afhankelijk van batch
  if (index < products.length - batchSize) {
    updateHeaderState("normal");
  } else {
    updateHeaderState("full");
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
  // force the scroll, and set header to compact immediately (observer will also handle)
  extraContent.scrollIntoView({ behavior: "smooth", block: "start" });
  updateHeaderState("compact");
}

function scrollToBatch3() {
  if (extraScrollLock) return;

  // laatste batch renderen
  index = products.length - batchSize;
  showBatch(index);

  // header + info-bar "full"
  updateHeaderState("full");

  // scroll helemaal naar boven
  extraScrollLock = true;
  window.scrollTo({ top: 0, behavior: "smooth" });

  // lock vrijgeven na animatie
  setTimeout(() => { extraScrollLock = false; }, 900);
}

// ========================
// 6b. IntersectionObserver: detecteer extraContent precies (onafhankelijk van gaps)
// ========================
if (extraContent) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target !== extraContent) return;
      if (entry.isIntersecting) {
        // zodra extraContent in beeld komt: compact header
        updateHeaderState("compact");
      } else {
        // extraContent buiten beeld: kies state afhankelijk van welke batch actief is
        if (index < products.length - batchSize) updateHeaderState("normal");
        else updateHeaderState("full");
      }
    });
  }, {
    root: null,
    threshold: 0.15 // 15% van extraContent in view => consider intersecting
  });

  io.observe(extraContent);
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
    if (!atBatch3()) {
      triggerStep("down");
    } else {
      scrollToExtraContent();
    }
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