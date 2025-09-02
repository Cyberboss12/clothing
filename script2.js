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

let index = 0;
const batchSize = 4;
let lock = false;
let carouselActive = true;

const SCROLL_THRESHOLD = 6;
const LOCK_MS = 300;
const TOUCH_THRESHOLD = 20;

// stages
const stage1 = document.getElementById("scrollStage1");
const stage2 = document.getElementById("scrollStage2");

function atEndOfCarousel() {
  return index + batchSize >= products.length;
}
function atStartOfCarousel() {
  return index === 0;
}

// batch rendering
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
  if (direction === "down" && !atEndOfCarousel()) {
    index += batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => (lock = false), LOCK_MS);
    return true;
  } else if (direction === "up" && !atStartOfCarousel()) {
    index -= batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => (lock = false), LOCK_MS);
    return true;
  }
  return false;
}


// ====================
// Stage switching
// ====================
function switchToStage2() {
  stage1.classList.add("hidden");
  stage2.classList.remove("hidden");
  stage2.scrollTo({ top: 0, behavior: "instant" });
  carouselActive = false;
}

function switchToStage1() {
  stage2.classList.add("hidden");
  stage1.classList.remove("hidden");
  stage1.scrollTo({ top: section.offsetTop, behavior: "instant" });
  carouselActive = true;
  index = products.length - batchSize;
  showBatch(index);
}


// ====================
// Events
// ====================
stage1.addEventListener("wheel", (e) => {
  if (carouselActive) {
    e.preventDefault();
    if (e.deltaY > SCROLL_THRESHOLD) {
      if (!atEndOfCarousel()) {
        triggerStep("down");
      } else {
        switchToStage2();
      }
    } else if (e.deltaY < -SCROLL_THRESHOLD) {
      if (!atStartOfCarousel()) {
        triggerStep("up");
      } else {
        stage1.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }
}, { passive: false });

stage2.addEventListener("wheel", (e) => {
  if (e.deltaY < -SCROLL_THRESHOLD && stage2.scrollTop === 0) {
    e.preventDefault();
    switchToStage1();
  }
}, { passive: false });


// TOUCH
let touchStartY = null;
section.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) {
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

section.addEventListener("touchmove", (e) => {
  if (lock || touchStartY === null) return;
  const y = e.touches[0].clientY;
  const dy = touchStartY - y;

  if (dy > TOUCH_THRESHOLD) { // swipe up
    if (carouselActive && !atEndOfCarousel()) {
      triggerStep("down");
      e.preventDefault();
    } else if (carouselActive && atEndOfCarousel()) {
      switchToStage2();
      e.preventDefault();
    }
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) { // swipe down
    if (carouselActive && !atStartOfCarousel()) {
      triggerStep("up");
      e.preventDefault();
    } else if (carouselActive && atStartOfCarousel()) {
      stage1.scrollTo({ top: 0, behavior: "smooth" });
      e.preventDefault();
    }
    touchStartY = null;
  }
}, { passive: false });

stage2.addEventListener("touchmove", (e) => {
  if (touchStartY === null) return;
  const y = e.touches[0].clientY;
  const dy = touchStartY - y;
  if (dy < -TOUCH_THRESHOLD && stage2.scrollTop === 0) {
    e.preventDefault();
    switchToStage1();
  }
}, { passive: false });

section.addEventListener("touchend", () => {
  touchStartY = null;
}, { passive: true });
