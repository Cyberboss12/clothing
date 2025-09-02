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

// instellingen: zeer gevoelig maar single-step
const SCROLL_THRESHOLD = 6;   // klein = gevoelig (muismoves/trackpad)
const LOCK_MS = 300;          // na trigger korte lock zodat inertie niet skipt
const TOUCH_THRESHOLD = 20;   // swipe gevoeligheid (px)

// helpers
function atEndOfCarousel() {
  return index + batchSize >= products.length;
}
function atStartOfCarousel() {
  return index === 0;
}

// smooth scroll helpers
function scrollToFooter() {
  document.querySelector("footer")
    .scrollIntoView({ behavior: "smooth", block: "start" });
}
function scrollToHeader() {
  document.querySelector("header")
    .scrollIntoView({ behavior: "smooth", block: "start" });
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
  if (lock) return;

  // scroll down
  if (deltaY > SCROLL_THRESHOLD) {
    if (!atEndOfCarousel()) {
      triggerStep("down");
    } else {
      scrollToFooter();
    }
  }

  // scroll up
  if (deltaY < -SCROLL_THRESHOLD) {
    if (!atStartOfCarousel()) {
      triggerStep("up");
    } else {
      scrollToHeader();
    }
  }
}


// ==============================
// 5. Events
// ==============================

// WHEEL → overal op de pagina besturen
window.addEventListener("wheel", (e) => {
  if (e.deltaY > 0 && !atEndOfCarousel()) {
    e.preventDefault();
    handleCarouselScroll(e.deltaY);
  } else if (e.deltaY < 0 && !atStartOfCarousel()) {
    e.preventDefault();
    handleCarouselScroll(e.deltaY);
  } else if (e.deltaY > 0 && atEndOfCarousel()) {
    // laat body gewoon door naar footer
    scrollToFooter();
  } else if (e.deltaY < 0 && atStartOfCarousel()) {
    // laat body gewoon terug naar header
    scrollToHeader();
  }
}, { passive: false });


// TOUCH → swipen binnen de sectie
let touchStartY = null;
section.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) {
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

section.addEventListener("touchmove", (e) => {
  if (lock || touchStartY === null) return;

  const y = e.touches[0].clientY;
  const dy = touchStartY - y; // positief = swipe up

  if (dy > TOUCH_THRESHOLD) {
    if (!atEndOfCarousel()) {
      triggerStep("down");
      e.preventDefault();
    } else {
      scrollToFooter();
    }
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) {
    if (!atStartOfCarousel()) {
      triggerStep("up");
      e.preventDefault();
    } else {
      scrollToHeader();
    }
    touchStartY = null;
  }
}, { passive: false });

section.addEventListener("touchend", () => {
  touchStartY = null;
}, { passive: true });