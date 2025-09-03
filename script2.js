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
let carouselActive = true; // bepaalt of carousel scroll blokkeert

// instellingen
const SCROLL_THRESHOLD = 6;
const LOCK_MS = 300;
const TOUCH_THRESHOLD = 20;

// helpers: check posities
function atEndOfCarousel() {
  return index + batchSize >= products.length;
}
function atStartOfCarousel() {
  return index === 0;
}

// smooth scroll helpers
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function scrollToExtraContent() {
  document.querySelector("#extraContent")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}
function scrollToCarousel(onDone) {
  section.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => {
    if (typeof onDone === "function") onDone();
  }, 600); // duur van smooth scroll
}

// render batch
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

// trigger step
function triggerStep(direction) {
  if (lock) return false;
  if (direction === 'down' && !atEndOfCarousel()) {
    index += batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => lock = false, LOCK_MS);
    return true;
  } else if (direction === 'up' && !atStartOfCarousel()) {
    index -= batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => lock = false, LOCK_MS);
    return true;
  }
  return false;
}


// ==============================
// 4. Scroll handler
// ==============================
function handleCarouselScroll(deltaY) {
  if (lock || !carouselActive) return;

  // scroll down
  if (deltaY > SCROLL_THRESHOLD) {
    if (!atEndOfCarousel()) {
      triggerStep("down");
    } else {
      carouselActive = false;
      scrollToExtraContent();
    }
  }

  // scroll up
  if (deltaY < -SCROLL_THRESHOLD) {
    if (!atStartOfCarousel()) {
      triggerStep("up");
    } else {
      scrollToTop();
    }
  }
}


// ==============================
// 5. Events
// ==============================

// WHEEL
window.addEventListener("wheel", (e) => {
  if (carouselActive) {
    e.preventDefault();
    handleCarouselScroll(e.deltaY);
  } else {
    // Carousel uit → check of we omhoog terugkomen
    if (e.deltaY < -SCROLL_THRESHOLD && window.scrollY <= section.offsetTop) {
      e.preventDefault();
      carouselActive = true;
      scrollToCarousel(() => {
        index = products.length - batchSize; // laatste batch (9–12)
        showBatch(index);
      });
    }
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
      carouselActive = false;
      scrollToExtraContent();
      e.preventDefault();
    }
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) { // swipe down
    if (carouselActive && !atStartOfCarousel()) {
      triggerStep("up");
      e.preventDefault();
    } else if (carouselActive && atStartOfCarousel()) {
      scrollToTop();
      e.preventDefault();
    } else if (!carouselActive && window.scrollY <= section.offsetTop) {
      carouselActive = true;
      scrollToCarousel(() => {
        index = products.length - batchSize;
        showBatch(index);
      });
      e.preventDefault();
    }
    touchStartY = null;
  }
}, { passive: false });

section.addEventListener("touchend", () => {
  touchStartY = null;
}, { passive: true });