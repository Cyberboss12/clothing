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
const extraContent = document.getElementById("extraContent");

let index = 0;
const batchSize = 4;
let lock = false;               // throttle per scroll/swipe
let carouselActive = true;      // bepaalt of de carousel momenteel scrollt

const SCROLL_THRESHOLD = 6;     // muis scroll gevoeligheid
const LOCK_MS = 300;            // throttle tijd
const TOUCH_THRESHOLD = 20;     // swipe gevoeligheid


// ====================
// 4. Helper functies
// ====================
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

function atEndOfCarousel() {
  return index + batchSize >= products.length;
}

function atStartOfCarousel() {
  return index === 0;
}

function triggerStep(direction) {
  if (lock) return false;

  if (direction === "down" && !atEndOfCarousel()) {
    index += batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => lock = false, LOCK_MS);
    return true;
  } else if (direction === "up" && !atStartOfCarousel()) {
    index -= batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => lock = false, LOCK_MS);
    return true;
  }
  return false;
}

// smooth scroll naar extra content
function scrollToExtraContent() {
  extraContent.scrollIntoView({ behavior: "smooth" });
}

// smooth scroll naar boven (header + info-bar + carousel)
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}


// ====================
// 5. Wheel event
// ====================
section.addEventListener("wheel", (e) => {
  e.preventDefault();

  if (!carouselActive) return;

  if (lock) return;

  if (e.deltaY > SCROLL_THRESHOLD) {
    // scroll naar beneden
    if (!atEndOfCarousel()) {
      triggerStep("down");
    } else {
      // laatste batch → smooth naar extra content
      carouselActive = false;
      scrollToExtraContent();
    }
  } else if (e.deltaY < -SCROLL_THRESHOLD) {
    // scroll naar boven
    if (!atStartOfCarousel()) {
      triggerStep("up");
    } else {
      scrollToTop();
    }
  }
}, { passive: false });


// ====================
// 6. Scroll omhoog vanuit extra content
// ====================
extraContent.addEventListener("wheel", (e) => {
  if (e.deltaY < -SCROLL_THRESHOLD && window.scrollY <= extraContent.offsetTop) {
    e.preventDefault();
    // smooth terug naar carousel + batch 9-12
    index = products.length - batchSize;
    showBatch(index);
    carouselActive = true;
    section.scrollIntoView({ behavior: "smooth" });
  }
}, { passive: false });


// ====================
// 7. Touch events (mobiel/tablet)
// ====================
let touchStartY = null;

section.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener("touchmove", (e) => {
  if (lock || touchStartY === null) return;
  const y = e.touches[0].clientY;
  const dy = touchStartY - y;

  if (dy > TOUCH_THRESHOLD) {
    // swipe omhoog → scroll naar beneden
    if (!atEndOfCarousel()) {
      triggerStep("down");
      e.preventDefault();
    } else {
      carouselActive = false;
      scrollToExtraContent();
      e.preventDefault();
    }
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) {
    // swipe omlaag → scroll naar boven
    if (!atStartOfCarousel()) {
      triggerStep("up");
      e.preventDefault();
    } else {
      scrollToTop();
      e.preventDefault();
    }
    touchStartY = null;
  }
}, { passive: false });

extraContent.addEventListener("touchmove", (e) => {
  if (!touchStartY && e.touches[0]) touchStartY = e.touches[0].clientY;
  if (!touchStartY) return;

  const y = e.touches[0].clientY;
  const dy = touchStartY - y;

  if (dy < -TOUCH_THRESHOLD && window.scrollY <= extraContent.offsetTop) {
    e.preventDefault();
    index = products.length - batchSize;
    showBatch(index);
    carouselActive = true;
    section.scrollIntoView({ behavior: "smooth" });
    touchStartY = null;
  }
}, { passive: false });

section.addEventListener("touchend", () => { touchStartY = null; }, { passive: true });
extraContent.addEventListener("touchend", () => { touchStartY = null; }, { passive: true });