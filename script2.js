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
  { img: "afbeeldingen/model.jpg", label: "Women" },
  { img: "afbeeldingen/model.jpg", label: "Children" },
  { img: "afbeeldingen/model.jpg", label: "Discover" },
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
let animating = false;
let carouselActive = true;

// settings
const SCROLL_THRESHOLD = 6;
const TOUCH_THRESHOLD = 20;
const LOCK_MS = 400;
const SMOOTH_MS = 600;

// ==============================
// 3. Helpers
// ==============================
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

function atEnd() {
  return index + batchSize >= products.length;
}
function atStart() {
  return index === 0;
}

function withLock(fn, ms = LOCK_MS) {
  if (lock) return;
  lock = true;
  fn();
  setTimeout(() => (lock = false), ms);
}

function smoothScrollToY(targetY) {
  animating = true;
  window.scrollTo({ top: targetY, behavior: "smooth" });
  setTimeout(() => (animating = false), SMOOTH_MS);
}

function getTopY(el) {
  return el.getBoundingClientRect().top + window.scrollY;
}

// ==============================
// 4. Scroll logic
// ==============================

// naar beneden
function stepDown() {
  if (lock || animating) return;

  if (!atEnd()) {
    // wissel batch
    withLock(() => {
      index += batchSize;
      showBatch(index);
    });
  } else if (atEnd() && index === products.length - batchSize && extraContent) {
    // pas vanaf laatste batch naar extra content
    carouselActive = false;
    const target = getTopY(extraContent);
    smoothScrollToY(target);
    withLock(() => {}, SMOOTH_MS);
  }
}

// naar boven
function stepUp() {
  if (lock || animating) return;

  if (carouselActive) {
    if (!atStart()) {
      // wissel batch
      withLock(() => {
        index -= batchSize;
        showBatch(index);
      });
    } else {
      // terug naar allereerste begin (header + info-bar)
      smoothScrollToY(0);
      withLock(() => {}, SMOOTH_MS);
    }
  } else {
    // vanaf extra content terug naar laatste batch (9–12) met header zichtbaar
    index = products.length - batchSize;
    showBatch(index);
    carouselActive = true;

    const target = getTopY(section);
    smoothScrollToY(target);
    withLock(() => {}, SMOOTH_MS);
  }
}

// ==============================
// 5. Event listeners
// ==============================

// Mouse wheel & touchpad
window.addEventListener(
  "wheel",
  e => {
    if (e.deltaY > SCROLL_THRESHOLD) {
      e.preventDefault();
      stepDown();
    } else if (e.deltaY < -SCROLL_THRESHOLD) {
      e.preventDefault();
      stepUp();
    }
  },
  { passive: false }
);

// Keyboard arrows
window.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    stepDown();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    stepUp();
  }
});

// Touch
let touchStartY = null;
window.addEventListener(
  "touchstart",
  e => {
    if (e.touches && e.touches[0]) {
      touchStartY = e.touches[0].clientY;
    }
  },
  { passive: true }
);

window.addEventListener(
  "touchmove",
  e => {
    if (touchStartY === null) return;
    const y = e.touches[0].clientY;
    const dy = touchStartY - y;

    if (dy > TOUCH_THRESHOLD) {
      e.preventDefault();
      stepDown();
      touchStartY = null;
    } else if (dy < -TOUCH_THRESHOLD) {
      e.preventDefault();
      stepUp();
      touchStartY = null;
    }
  },
  { passive: false }
);

window.addEventListener(
  "touchend",
  () => {
    touchStartY = null;
  },
  { passive: true }
);