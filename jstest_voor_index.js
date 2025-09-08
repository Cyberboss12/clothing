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
const LOCK_MS = 600;
const TOUCH_THRESHOLD = 20;

let globalLock = false; // nieuwe lock voor ALLE scrolls
let inBatch3Confirmed = false; // houdt bij of batch 3 al 'actief' is

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
  if (globalLock) return;

  if (direction === "down" && index + batchSize < products.length) {
    index += batchSize;
    showBatch(index);
  } else if (direction === "up" && index - batchSize >= 0) {
    index -= batchSize;
    showBatch(index);
  }

  lockGlobal();
}

function atBatch3() {
  return index >= products.length - batchSize;
}

// ========================
// 6. Smooth scroll helpers
// ========================
function scrollToExtraContent() {
  if (globalLock) return;
  extraContent.scrollIntoView({ behavior: "smooth", block: "start" });
  lockGlobal();
}

function scrollToBatch3() {
  if (globalLock) return;

  // laatste batch renderen
  index = products.length - batchSize;
  showBatch(index);
  inBatch3Confirmed = true;

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

  // scroll naar boven van de sectie
  window.scrollTo({ top: section.offsetTop, behavior: "smooth" });

  lockGlobal();
}

function lockGlobal() {
  globalLock = true;
  setTimeout(() => {
    globalLock = false;
  }, LOCK_MS);
}

// ========================
// 7. Event handlers
// ========================

// Mouse wheel / touchpad
window.addEventListener("wheel", (e) => {
  const deltaY = e.deltaY;

  if (deltaY > 0) { // scroll down
    e.preventDefault();
    if (!atBatch3()) {
      triggerStep("down");
    } else if (!inBatch3Confirmed) {
      scrollToBatch3();
    } else {
      scrollToExtraContent();
    }
  } else if (deltaY < 0) { // scroll up
    e.preventDefault();
    if (window.scrollY > section.offsetTop + 10) {
      scrollToBatch3();
    } else if (inBatch3Confirmed) {
      inBatch3Confirmed = false;
      triggerStep("up");
    } else {
      triggerStep("up");
    }
  }
}, { passive: false });

// Pijltoetsen
window.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") {
    if (!atBatch3()) triggerStep("down");
    else if (!inBatch3Confirmed) scrollToBatch3();
    else scrollToExtraContent();
  } else if (e.key === "ArrowUp") {
    if (window.scrollY > section.offsetTop + 10) scrollToBatch3();
    else if (inBatch3Confirmed) {
      inBatch3Confirmed = false;
      triggerStep("up");
    } else {
      triggerStep("up");
    }
  }
});

// Touch
let touchStartY = null;
section.addEventListener("touchstart", e => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener("touchmove", e => {
  if (touchStartY === null || globalLock) return;
  const dy = touchStartY - e.touches[0].clientY;

  if (dy > TOUCH_THRESHOLD) { // swipe up
    e.preventDefault();
    if (!atBatch3()) triggerStep("down");
    else if (!inBatch3Confirmed) scrollToBatch3();
    else scrollToExtraContent();
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) { // swipe down
    e.preventDefault();
    if (window.scrollY > section.offsetTop + 10) {
      scrollToBatch3();
    } else if (inBatch3Confirmed) {
      inBatch3Confirmed = false;
      triggerStep("up");
    } else {
      triggerStep("up");
    }
    touchStartY = null;
  }
}, { passive: false });

section.addEventListener("touchend", () => { touchStartY = null; });
